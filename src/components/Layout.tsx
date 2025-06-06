import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { Page } from '../App';

interface LayoutProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}

export function Layout({ currentPage, setCurrentPage, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
