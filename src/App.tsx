import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import Tugas from './pages/Tugas';

export type Page = 'dashboard' | 'history' | 'about' | 'tugas';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tugas':
        return <Tugas />;
      case 'history':
        return <History />;
      case 'about':
        return <About />;
      default:
        return <div>Halaman tidak ditemukan</div>;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
