'use client';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export default function Header({ title = "한평생 상담센터", showLogo = true }: HeaderProps) {
  return (
    <div 
      className="flex items-center justify-between p-6 bg-[#F7F7F8]" 
      style={{ borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem' }}
    >
      <div className="flex items-center gap-3">
        {showLogo && (
          <div className="w-[56px] h-[56px]flex items-center justify-center">
            <span className="text-white font-bold text-sm"><img src="/logo.png" alt="logo" className="rounded-[23.52px]"/></span>
          </div>
        )}
        <h1 className="font-bold text-[22px] text-gray-900">{title}</h1>
      </div>
    </div>
  );
}
