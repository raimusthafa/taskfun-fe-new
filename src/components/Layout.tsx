import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = React.useState(true);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="pr-3">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isDesktopOpen={isDesktopOpen}
          setIsDesktopOpen={setIsDesktopOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
