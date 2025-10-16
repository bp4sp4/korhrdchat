'use client';

import { ArrowLeft, User, Bell, Shield, Palette, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

const SettingsPage = () => {
  const router = useRouter();

  const settingsItems = [
    {
      icon: User,
      title: '프로필 설정',
      description: '프로필 정보를 수정합니다',
      onClick: () => console.log('프로필 설정')
    },
    {
      icon: Bell,
      title: '알림 설정',
      description: '알림 옵션을 관리합니다',
      onClick: () => console.log('알림 설정')
    },
    {
      icon: Shield,
      title: '개인정보 보호',
      description: '개인정보 설정을 변경합니다',
      onClick: () => console.log('개인정보 보호')
    },
    {
      icon: Palette,
      title: '테마 설정',
      description: '앱 테마를 변경합니다',
      onClick: () => console.log('테마 설정')
    },
    {
      icon: HelpCircle,
      title: '도움말 및 지원',
      description: '자주 묻는 질문과 고객지원',
      onClick: () => console.log('도움말')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen pb-20">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-white/20 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">설정</h1>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-white/20 text-white text-lg">
                사용자
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">사용자</h2>
              <p className="text-white/80 text-sm">user@example.com</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="p-6">
          <div className="space-y-2">
            {settingsItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  onClick={item.onClick}
                  className="p-4 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 pt-0">
          <Button
            variant="outline"
            onClick={() => console.log('로그아웃')}
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
