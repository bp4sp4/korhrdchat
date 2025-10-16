'use client';

import { Home, MessageCircle, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const BottomNavigation = () => {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/' || pathname === '/home') return 'home';
    if (pathname.startsWith('/user-chats')) return 'chat';
    if (pathname === '/settings') return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around p-4 max-w-md mx-auto">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">홈</span>
        </Link>
        <Link
          href="/user-chats"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'chat' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-medium">대화</span>
        </Link>
        <Link
          href="/settings"
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">설정</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;


