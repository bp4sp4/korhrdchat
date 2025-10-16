'use client';

import { useState, useEffect } from 'react';
import { supabase, Chat, Message, Agent } from '@/lib/supabase';

export const useAgent = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all chats for agents
  const fetchAllChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages:message(content, created_at, sender_type)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all agents
  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Assign chat to agent
  const assignChatToAgent = async (chatId: string, agentId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ 
          agent_id: agentId,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) throw error;
    } catch (error) {
      console.error('Error assigning chat:', error);
      throw error;
    }
  };

  // Send message as agent
  const sendAgentMessage = async (chatId: string, content: string, agentId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: agentId,
          sender_type: 'agent',
          content: content.trim(),
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update chat updated_at
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return data;
    } catch (error) {
      console.error('Error sending agent message:', error);
      throw error;
    }
  };

  // Update chat status
  const updateChatStatus = async (chatId: string, status: 'waiting' | 'active' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating chat status:', error);
      throw error;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchAllChats();
    fetchAgents();

    const subscription = supabase
      .channel('agent_chats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        () => {
          fetchAllChats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchAllChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    chats,
    agents,
    loading,
    assignChatToAgent,
    sendAgentMessage,
    updateChatStatus,
    fetchAllChats,
    fetchAgents
  };
};
