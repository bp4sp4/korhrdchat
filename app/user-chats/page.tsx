'use client';

import { useState } from 'react';
import { Plus, Search, MessageCircle, Clock, User, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface ChatRoom {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const UserChatsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock chat data - in real app, this would come from your database
  const [chats] = useState<ChatRoom[]>([
    {
      id: '68f0a79c3e603eee4e8d',
      title: '상담사 김민수',
      lastMessage: '네, 도움이 되었다니 다행입니다.',
      timestamp: '10:30',
      unreadCount: 2
    },
    {
      id: 'a1b2c3d4e5f6789012',
      title: '상담사 이영희',
      lastMessage: '추가로 궁금한 점이 있으시면 언제든 말씀해주세요.',
      timestamp: '09:15',
      unreadCount: 0
    }
  ]);

  const generateChatId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleCreateChat = () => {
    const chatId = generateChatId();
    router.push(`/user-chats/${chatId}`);
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Phone Container */}
      <div className="relative mx-auto">
        {/* Phone Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl" style={{ width: '406px', height: '706px' }}>
          {/* Screen */}
          <div className="relative bg-background rounded-[2.5rem] overflow-hidden" style={{ width: '390px', height: '690px' }}>
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-background z-10 flex items-center justify-between px-6 pt-2">
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="text-xs font-semibold">9:41</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-6 h-3 bg-black rounded-sm"></div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-8 h-full flex flex-col">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">내 대화</h1>
                  <Button
                    onClick={handleCreateChat}
                    variant="secondary"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="대화 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">대화가 없습니다</p>
                    <p className="text-sm text-center">
                      새로운 상담을 시작해보세요
                    </p>
                    <Button onClick={handleCreateChat} className="mt-4">
                      새 대화 시작
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => router.push(`/user-chats/${chat.id}`)}
                        className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <User className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {chat.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {chat.timestamp}
                                </span>
                                {chat.unreadCount > 0 && (
                                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="bg-background/95 backdrop-blur-lg border-t border-border">
                <div className="flex items-center justify-around p-4">
                  <Link
                    href="/"
                    className="flex flex-col items-center gap-1 transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Home className="w-6 h-6" />
                    <span className="text-xs font-medium">홈</span>
                  </Link>
                  <Link
                    href="/user-chats"
                    className="flex flex-col items-center gap-1 transition-colors text-primary"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs font-medium">대화</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex flex-col items-center gap-1 transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-xs font-medium">설정</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserChatsPage;
