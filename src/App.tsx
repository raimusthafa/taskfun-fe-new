import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { About } from './pages/About';
import Tugas from './pages/Tugas';
import LandingPage from './pages/LandingPage';
import { Layout } from './components/Layout';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tugas" element={<Tugas />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
      </Routes>
    </Router>
  );
}
