'use client';

import { useState } from 'react';
import { Plus, Search, MessageCircle, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UserChatsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, loading, createChat, fetchChats } = useChat();

  const handleCreateChat = async () => {
    try {
      // 사용자 이름을 입력받거나 기본값 사용
      const userName = prompt('이름을 입력해주세요:') || '익명 사용자';
      await createChat(userName);
      // 새 채팅 생성 후 대화 리스트 새로고침
      await fetchChats();
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  // Transform chats data for display
  const transformedChats = chats.map(chat => ({
    id: chat.id,
    title: chat.name || '한평생 상담센터',
    lastMessage: chat.messages && chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1].content 
      : '새로운 대화가 시작되었습니다.',
    timestamp: chat.updated_at ? new Date(chat.updated_at).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : '시간 정보 없음',
    unreadCount: chat.messages ? 
      chat.messages.filter(msg => !msg.is_read && msg.sender_type === 'agent').length : 0,
    agent_id: chat.agent_id
  }));

  const filteredChats = transformedChats
    .filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
    // .filter(chat => !chat.agent_id) // 부재중 채팅만 (agent_id가 없는 것) - 임시로 주석 처리
    .slice(0, 2); // 최대 2개만 표시

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F7F8' }}>
      {/* Main Container */}
      <div className="relative bg-white shadow-2xl" style={{ width: '390px', height: '690px', borderRadius: '2.5rem' }}>
        {/* Top Header */}
        <Header title="내 대화" />

        {/* Content */}
        <div className="flex flex-col" style={{ height: 'calc(100% - 80px)' }}>
          <div className="px-6 py-4 flex-1 flex flex-col">
            {/* Search Section */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="대화 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg font-medium">대화 목록을 불러오는 중...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">부재중 채팅이 없습니다</p>
                <p className="text-sm text-center mb-4">
                  모든 상담사가 온라인 상태입니다
                </p>
                <Button onClick={handleCreateChat} className="bg-blue-500 hover:bg-blue-600">
                  새 대화 시작
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/user-chats/${chat.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-xl border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {chat.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {chat.timestamp}
                            </span>
                            {chat.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate flex-1">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center gap-1 ml-2">
                            <div className={`w-2 h-2 rounded-full ${chat.agent_id ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            <span className={`text-xs ${chat.agent_id ? 'text-green-600' : 'text-orange-500'}`}>
                              {chat.agent_id ? '온라인' : '대기중'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>

          {/* Bottom Navigation */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default UserChatsPage;
