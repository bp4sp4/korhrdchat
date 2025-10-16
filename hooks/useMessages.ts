'use client';

import { useState, useEffect } from 'react';
import { supabase, Message, Chat } from '@/lib/supabase';

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Generate a unique user ID for this session
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('chat_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_user_id', userId);
      }
      return userId;
    }
    return 'anonymous';
  };

  // Fetch messages for a chat
  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (chatError) throw chatError;

      setMessages(messagesData || []);
      setChat(chatData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!chatId || !content.trim()) return;

    setSending(true);
    try {
      const userId = getUserId();
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          sender_type: 'user',
          content: content.trim(),
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update chat status to active if it's waiting
      if (chat?.status === 'waiting') {
        await supabase
          .from('chats')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', chatId);
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!chatId) return;

    fetchMessages();

    const subscription = supabase
      .channel(`messages_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as Message : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  return {
    messages,
    chat,
    loading,
    sending,
    sendMessage,
    fetchMessages
  };
};
