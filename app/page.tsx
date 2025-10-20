'use client';

import { useState } from 'react';
import { MessageCircle, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
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

  const handleInquiryClick = () => {
    // 바로 채팅 목록으로 이동
    router.push('/user-chats');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F7F8' }}>
      {/* Main Container */}
      <div className="relative bg-[#F7F7F8] shadow-2xl" style={{ width: '390px', height: '690px', borderRadius: '2.5rem' }}>
        {/* Top Header */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-col" style={{ height: 'calc(100% - 80px)' }}>
          <div className="px-6 py-4 flex-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Greeting Section */}
            <div className="flex items-center gap-3 mb-4">
              {/* Small Logo */}
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">로고</span>
              </div>
              <h2 className="text-base font-semibold text-gray-900">한평생 상담센터</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-900 mb-2">안녕하세요. 한평생 상담센터입니다. 😊</p>
              
              <div className="flex items-center gap-2 mb-4">
                <ChevronDown className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-700">
                  아래 내용은 상담사에게 직접 문의해주세요!
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>계정 관련 문의 및 변경</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>서비스 이용 방법 안내</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>기타 궁금한 사항</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleInquiryClick} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium text-base"
            >
              문의하기
              <Send className="w-5 h-5 ml-2" />
            </Button>

            {/* Name Input Modal */}
            {showNameInput && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 m-4 w-80">
                  <h3 className="text-lg font-semibold mb-4">이름을 입력해주세요</h3>
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-3">
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
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                      disabled={!userName.trim()}
                    >
                      시작하기
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Contact Methods */}
            <div className="mt-6">
              <p className="text-sm text-gray-700 mb-4">다른 방법으로 문의</p>
              <div className="flex gap-4 justify-center">
              
              </div>
            </div>

            {/* Service Status */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span>실시간 상담 서비스 이용중</span>
            </div>
          </div>
          </div>

          {/* Bottom Navigation */}
          <Footer />
        </div>
      </div>
    </div>
  );
}