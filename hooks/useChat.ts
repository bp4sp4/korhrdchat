'use client';

import { useState, useEffect } from 'react';
import { supabase, Room, Message } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const useChat = () => {
  const [chats, setChats] = useState<Room[]>([]);
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
  const createChat = async (userName: string) => {
    try {
      const userId = getUserId();
      
      // 1. room 생성
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert({
          name: '한평생 상담센터',
          status: 'waiting'
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // 2. room_participants에 사용자 추가
      const { error: participantError } = await supabase
        .from('room_participants')
        .insert({
          room_id: roomData.id,
          user_name: userId, // userId를 사용하여 일관성 유지
          user_type: 'customer' // CHECK 제약조건: 'customer' 또는 'agent'만 허용
        });

      if (participantError) throw participantError;
      
      // 새 채팅 생성 후 대화 리스트 즉시 업데이트
      await fetchChats();
      
      router.push(`/user-chats/${roomData.id}`);
      return roomData;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      const userId = getUserId();
      console.log('Fetching chats for user:', userId);
      
      // 사용자가 참여한 rooms 조회 (최신순 정렬)
      const { data: userRooms, error: roomsError } = await supabase
        .from('room_participants')
        .select(`
          room_id,
          rooms (
            id,
            name,
            status,
            agent_id,
            created_at,
            updated_at,
            messages (
              content,
              created_at,
              sender_type
            )
          )
        `)
        .eq('user_name', userId)
        .order('updated_at', { referencedTable: 'rooms', ascending: false });

      if (roomsError) {
        console.error('Supabase error:', roomsError);
        throw roomsError;
      }
      
      // 데이터 구조 변환 - 타입 안전성 확보
      const transformedRooms: Room[] = [];
      if (userRooms) {
        for (const item of userRooms) {
          if (item.rooms) {
            transformedRooms.push(item.rooms as unknown as Room);
          }
        }
      }
      
      // 최신순으로 정렬 (클라이언트 사이드에서 한번 더 정렬)
      transformedRooms.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('Chats fetched successfully:', transformedRooms);
      setChats(transformedRooms);
    } catch (error) {
      console.error('Error fetching chats:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchChats();

    const userId = getUserId();
    
    const subscription = supabase
      .channel('rooms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `user_name=eq.${userId}`
        },
        () => {
          fetchChats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms'
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

