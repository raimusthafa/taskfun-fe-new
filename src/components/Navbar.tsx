import { useState, useEffect } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { RainbowButton } from '@/components/ui/rainbow-button';

const { Header } = Layout;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Header
      className="mx-6 md:mx-28 rounded-xl transition-all duration-300"
      style={{
        position: 'sticky',
        top: 5,
        zIndex: 1000,
        backgroundColor: '#fff',
        boxShadow: isScrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="font-bold text-xl text-gray-900">TaskFun</div>

        {/* Menu (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
                <Button variant='text' color='default'>
                    Login
                </Button>
            </Link>
          <Link to="/register">
            <RainbowButton>Mulai Sekarang</RainbowButton>
          </Link>
        </div>

        {/* Menu button (mobile) */}
        <div className="md:hidden">
          <Button
            type="text"
            icon={openMenu ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setOpenMenu(!openMenu)}
          />
        </div>
      </div>

      {/* Drawer (mobile menu) */}
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setOpenMenu(false)}
        open={openMenu}
        bodyStyle={{ padding: 24 }}
      >
        <div className="flex flex-col gap-4">
          <Link to="/login" onClick={() => setOpenMenu(false)}>
            <button className="w-full px-6 py-2 border border-gray-300 rounded-full text-gray-800 font-medium bg-transparent hover:bg-gray-900 hover:text-white transition duration-300">
              Login
            </button>
          </Link>
          <Link to="/register" onClick={() => setOpenMenu(false)}>
            <RainbowButton className="w-full">Mulai Sekarang</RainbowButton>
          </Link>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
