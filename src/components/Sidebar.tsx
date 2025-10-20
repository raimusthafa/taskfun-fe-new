import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  CheckSquareIcon,
  HistoryIcon,
  InfoIcon,
  X,
  PanelLeftClose,
  Menu as MenuIcon,
  ListChecks,
} from 'lucide-react';
import { Drawer, Menu, Button, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopOpen: boolean;
  setIsDesktopOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, onClose, isDesktopOpen, setIsDesktopOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon size={18} /> },
    { key: '/tugas', label: 'Tugas', icon: <CheckSquareIcon size={18} /> },
    // { key: '/undangan-tugas', label: 'Undangan Tugas', icon: <CheckSquareIcon size={18} /> },
    { key: '/category', label: 'Kategori', icon: <ListChecks size={18} /> },
    { key: '/history', label: 'Riwayat', icon: <HistoryIcon size={18} /> },
    { key: '/about', label: 'Tentang', icon: <InfoIcon size={18} /> }
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    onClose(); // tutup drawer jika di mobile
  };

  // Auto-close drawer ketika screen besar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) onClose();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  return (
    <>
      {/* Sidebar untuk desktop */}
      <aside
        className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200 relative"
        style={{
          width: isDesktopOpen ? 256 : 64,
          transition: 'width 0.5s ease',
        }}
      >
        <div
          className={`p-4 border-b border-gray-200 flex items-center ${
            isDesktopOpen ? 'justify-between' : 'justify-center'
          }`}
          style={{ transition: 'all 0.5s ease' }}
        >
          {isDesktopOpen ? (
            <h1
              className="text-xl font-bold text-blue-600"
              style={{ transition: 'opacity 0.3s ease', opacity: 1 }}
            >
              TaskFun
            </h1>
          ) : (
            <Tooltip title="Buka menu" placement='rightTop'>
              <button
                onClick={() => setIsDesktopOpen(true)}
                aria-label="Open sidebar"
                className="text-blue-600 focus:outline-none z-10 cursor-pointer"
                style={{ position: 'relative' }}
                
              >
                <MenuIcon size={24} />
              </button>
            </Tooltip>
          )}
          {isDesktopOpen && (
            <Tooltip title="Tutup menu" placement='rightTop'>
              <button
                onClick={() => setIsDesktopOpen(false)}
                aria-label="Close sidebar"
                className="text-blue-600 focus:outline-none z-10 cursor-pointer"
                style={{ position: 'relative' }}
              >
                <PanelLeftClose size={24} />
              </button>
            </Tooltip>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            width: '100%',
            borderRight: 0,
            ...( !isDesktopOpen ? { textAlign: 'center' } : {} )
          }}
          inlineCollapsed={!isDesktopOpen}
          className={ !isDesktopOpen ? 'collapsed-menu' : '' }
        />
      </aside>

      {/* Drawer untuk mobile */}
      <Drawer
        title={
          <div className="flex justify-between items-center text-blue-600 font-bold text-lg">
            <span>TaskFun</span>
            <Button
              type="text"
              onClick={onClose}
              aria-label="Close"
              className="p-0"
              icon={<X size={18} />}
            />
          </div>
        }
        placement="left"
        closeIcon={null}
        onClose={onClose}
        open={isOpen}
        width={250}
        className="md:hidden"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ flex: 1, borderRight: 0 }}
        />
      </Drawer>
    </>
  );
}
