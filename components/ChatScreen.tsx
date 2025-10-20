'use client';

import React, { useState } from 'react';
import { MessageCircle, Plus, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useChat } from '@/hooks/useChat';

interface ChatScreenProps {
  width?: number;
  height?: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ width = 390, height = 690 }) => {
  const router = useRouter();
  const { createChat } = useChat();
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');

  const handleCreateChat = async () => {
    if (!userName.trim()) {
      setShowNameInput(true);
      return;
    }
    
    try {
      await createChat(userName.trim());
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <div className="relative mx-auto">
      {/* Phone Frame */}
      <div
        className="relative bg-black rounded-[3rem] p-2 shadow-2xl"
        style={{ width: `${width + 16}px`, height: `${height + 16}px` }}
      >
        {/* Screen */}
        <div
          className="relative bg-background rounded-[2.5rem] overflow-hidden"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
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
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                <MessageCircle className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">라이브 채팅</h2>
              
              
              <p className="text-muted-foreground text-center mb-8">
                언제든지 상담사와 실시간으로 소통하세요.
              </p>
              
              {/* 사용자 이름 입력 */}
              {showNameInput && (
                <div className="w-full max-w-xs mb-4 space-y-3">
                  <Input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                    className="text-center"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setShowNameInput(false);
                        setUserName('');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={handleCreateChat}
                      className="flex-1"
                      disabled={!userName.trim()}
                    >
                      시작하기
                    </Button>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleCreateChat} 
                className="w-full max-w-xs"
              >
                <Plus className="w-5 h-5 mr-2" />
                문의하기
              </Button>
              <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">상담 가능</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <div className="text-2xl font-bold text-primary">즉시</div>
                  <div className="text-sm text-muted-foreground">응답</div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bg-background/95 backdrop-blur-lg border-t border-border">
              <div className="flex items-center justify-around p-4">
                <Link
                  href="/"
                  className="flex flex-col items-center gap-1 transition-colors text-primary"
                >
                  <Home className="w-6 h-6" />
                  <span className="text-xs font-medium">홈</span>
                </Link>
                <Link
                  href="/user-chats"
                  className="flex flex-col items-center gap-1 transition-colors text-muted-foreground hover:text-primary"
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
  );
};

export default ChatScreen;