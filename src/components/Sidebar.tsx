import {
  LayoutDashboardIcon,
  CheckSquareIcon,
  HistoryIcon,
  InfoIcon,
  LogOutIcon,
  XIcon
} from 'lucide-react';
import type { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon size={20} /> },
    { id: 'tugas', label: 'Tugas', icon: <CheckSquareIcon size={20} /> },
    { id: 'history', label: 'Riwayat', icon: <HistoryIcon size={20} /> },
    { id: 'about', label: 'Tentang', icon: <InfoIcon size={20} /> }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden transition-opacity ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed z-40 md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">TaskFun</h1>
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-gray-800"
          >
            <XIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setCurrentPage(item.id as Page);
                    onClose();
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center text-gray-600 hover:text-gray-800 w-full px-4 py-2 rounded-lg hover:bg-gray-100">
            <LogOutIcon size={20} className="mr-3" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
}
