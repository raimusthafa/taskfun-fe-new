import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const { user, getProfile } = useUserStore();

  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      getProfile().catch(() => {});
    }
  }, [user, getProfile]);

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
