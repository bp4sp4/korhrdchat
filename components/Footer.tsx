'use client';

import { HomeIcon, MessageCircle, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: HomeIcon, label: '홈' },
    { href: '/user-chats', icon: MessageCircle, label: '대화' },
    { href: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 bg-[#F7F7F8] border-t border-gray-100" 
      style={{ borderBottomLeftRadius: '2.5rem', borderBottomRightRadius: '2.5rem' }}
    >
      <div className="flex items-center justify-around py-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <div className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === href ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
            }`}>
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
