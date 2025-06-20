import { ReactNode, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  sidebarContent: ReactNode;
  headerContent: ReactNode;
  className?: string;
}

export function AppLayout({
  children,
  sidebarContent,
  headerContent,
  className,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none',
          'transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-900/80" />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">DuctSizer Pro</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">{sidebarContent}</nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />
          
          {/* Header content */}
          <div className="flex-1">
            {headerContent}
          </div>
        </div>

        {/* Page content */}
        <main className={cn('py-6 px-4 sm:px-6 lg:px-8', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
