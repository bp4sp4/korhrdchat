'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  isRead: boolean;
}

interface ChatRoomPageProps {
  params: {
    id: string;
  };
}

const ChatRoomPage = ({ params }: ChatRoomPageProps) => {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요! 무엇을 도와드릴까요?',
      sender: 'agent',
      timestamp: '10:30',
      isRead: true
    },
    {
      id: 2,
      text: '안녕하세요! 상품 문의가 있어서 연락드렸습니다.',
      sender: 'user',
      timestamp: '10:31',
      isRead: true
    },
    {
      id: 3,
      text: '네, 어떤 상품에 대해 문의하시나요?',
      sender: 'agent',
      timestamp: '10:32',
      isRead: true
    },
    {
      id: 4,
      text: '스마트폰 케이스 관련해서요. 방수 기능이 있는 제품이 있는지 궁금합니다.',
      sender: 'user',
      timestamp: '10:33',
      isRead: false
    }
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      
      // Simulate agent response after 2 seconds
      setTimeout(() => {
        const agentResponse: Message = {
          id: messages.length + 2,
          text: '네, 방수 기능이 있는 케이스가 여러 종류 있습니다. 어떤 모델의 스마트폰을 사용하시나요?',
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen flex flex-col pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">상담사 김민수</h3>
              <p className="text-xs text-green-600">온라인</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-2 max-w-[80%]">
                  {message.sender === 'agent' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                      {message.sender === 'user' && (
                        <span
                          className={`text-xs ${
                            message.isRead ? 'text-blue-400' : 'text-muted-foreground'
                          }`}
                        >
                          {message.isRead ? '읽음' : '전송됨'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ChatRoomPage;
