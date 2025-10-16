'use client';

import { useState } from 'react';
import { MessageCircle, Users, Clock, Search, User, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomerChat {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  status: 'waiting' | 'active' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  unreadCount: number;
}

const AgentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'active' | 'resolved'>('all');
  
  // Mock data for agent dashboard
  const [customerChats] = useState<CustomerChat[]>([
    {
      id: '68f0a79c3e603eee4e8d',
      customerName: '김고객',
      lastMessage: '스마트폰 케이스 관련 문의가 있습니다.',
      timestamp: '10:30',
      status: 'active',
      priority: 'medium',
      unreadCount: 2
    },
    {
      id: 'a1b2c3d4e5f6789012',
      customerName: '이고객',
      lastMessage: '배송 문의입니다.',
      timestamp: '09:15',
      status: 'waiting',
      priority: 'high',
      unreadCount: 1
    },
    {
      id: 'c3d4e5f6g7h8901234',
      customerName: '박고객',
      lastMessage: '감사합니다. 문제가 해결되었습니다.',
      timestamp: '08:45',
      status: 'resolved',
      priority: 'low',
      unreadCount: 0
    }
  ]);

  const filteredChats = customerChats.filter(chat => {
    const matchesSearch = chat.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'resolved': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return '대기중';
      case 'active': return '진행중';
      case 'resolved': return '완료';
      default: return '알 수 없음';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">상담사 대시보드</h1>
              <p className="text-muted-foreground">고객 상담 관리 시스템</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">활성 대화</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-muted-foreground">대기중</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-border">
              {/* Search and Filter */}
              <div className="p-4 border-b border-border">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="고객 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'waiting', 'active', 'resolved'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="text-xs"
                    >
                      {status === 'all' ? '전체' : getStatusText(status)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat List */}
              <ScrollArea className="h-96">
                <div className="divide-y divide-border">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        selectedChat === chat.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {chat.customerName}
                            </h3>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {chat.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-2">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                              {getStatusText(chat.status)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(chat.priority)}`}>
                              {getPriorityText(chat.priority)}
                            </span>
                            {chat.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-border h-96 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {customerChats.find(c => c.id === selectedChat)?.customerName}
                        </h3>
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

                  {/* Chat Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl px-4 py-2 max-w-[70%]">
                          <p className="text-sm">안녕하세요! 무엇을 도와드릴까요?</p>
                          <p className="text-xs text-muted-foreground mt-1">10:30</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-[70%]">
                          <p className="text-sm">스마트폰 케이스 관련 문의가 있습니다.</p>
                          <p className="text-xs text-primary-foreground/70 mt-1">10:31</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl px-4 py-2 max-w-[70%]">
                          <p className="text-sm">네, 어떤 상품에 대해 문의하시나요?</p>
                          <p className="text-xs text-muted-foreground mt-1">10:32</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="메시지를 입력하세요..."
                        className="flex-1"
                      />
                      <Button>
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">대화를 선택하세요</p>
                    <p className="text-sm">좌측에서 고객과의 대화를 선택하여 상담을 시작하세요.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
