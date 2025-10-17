'use client';

import { useState, useEffect, use, useRef } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useMessages } from '@/hooks/useMessages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ChatRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ChatRoomPage = ({ params }: ChatRoomPageProps) => {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');
  const resolvedParams = use(params) as { id: string };
  const { messages, chat, loading, sending, sendMessage } = useMessages(resolvedParams.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (messageInput.trim() && !sending) {
      try {
        await sendMessage(messageInput);
        setMessageInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지가 추가될 때마다 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F7F8' }}>
      {/* Main Container */}
      <div className="relative bg-white shadow-2xl" style={{ width: '390px', height: '690px', borderRadius: '2.5rem' }}>
        {/* Custom Header for Chat */}
        <div 
          className="flex items-center justify-between p-4 bg-white border-b border-gray-100" 
          style={{ borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem' }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-500 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`font-semibold ${chat?.agent_id ? 'text-green-600' : 'text-orange-500'}`}>
                {chat?.agent_id ? '연결되었습니다' : '상담사 담당 대기중'}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col h-full">

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <p>대화를 시작해보세요!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex gap-2 max-w-[80%]">
                      {message.sender_type === 'agent' && (
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.sender_type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <p
                            className={`text-xs ${
                              message.sender_type === 'user' ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString('ko-KR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          {message.sender_type === 'user' && (
                            <span
                              className={`text-xs ${
                                message.is_read ? 'text-blue-200' : 'text-white/70'
                              }`}
                            >
                              {message.is_read ? '읽음' : '전송됨'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* 자동 스크롤을 위한 참조 요소 */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-gray-50 border-gray-200"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                disabled={sending || !messageInput.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <Footer />
      </div>
    </div>
  );
};

export default ChatRoomPage;
