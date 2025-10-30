import { Navbar } from '@/components/layout/navbar';

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className='relative min-h-full'>
      {/* Navbar */}
      <Navbar title={title} />
      
      {/* Main Content Area */}
      <div className='p-6 sm:p-8 lg:p-10'>
        <div className='relative'>
          {/* Background Pattern with Violet Gradient */}
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.08),rgba(167,139,250,0.04),rgba(255,255,255,0))] pointer-events-none -z-10' />
          
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
