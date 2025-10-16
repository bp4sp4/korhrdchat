'use client';

import { useState, useEffect } from 'react';
import { supabase, Chat, Message } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // Create a new chat
  const createChat = async () => {
    try {
      const userId = getUserId();
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;
      
      router.push(`/user-chats/${data.id}`);
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      const userId = getUserId();
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages:message(content, created_at, sender_type)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchChats();

    const userId = getUserId();
    
    const subscription = supabase
      .channel('chats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    chats,
    loading,
    createChat,
    fetchChats
  };
};
