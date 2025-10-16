'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import { useMessages } from '@/hooks/useMessages';

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
              <h3 className="font-semibold text-foreground">
                {chat?.agent_id ? '상담사' : '대기 중'}
              </h3>
              <p className="text-xs text-green-600">
                {chat?.agent_id ? '온라인' : '상담사 연결 중...'}
              </p>
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
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
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
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender_type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <p
                          className={`text-xs ${
                            message.sender_type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
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
                              message.is_read ? 'text-blue-400' : 'text-muted-foreground'
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
            <Button onClick={handleSendMessage} size="icon" disabled={sending || !messageInput.trim()}>
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
