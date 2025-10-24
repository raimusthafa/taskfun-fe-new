import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { About } from './pages/About';
import Tugas from './pages/Tugas';
import { Layout } from './components/Layout';
import Register from './components/RegisterPage';
import Login from './components/LoginPage';
import NotFound from './components/NotFound';
import DetailTask from './pages/DetailTask';
import PrivateRoute from './components/PrivateRoute';
import Category from './pages/Category';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Notifications from './pages/Notifikasi';
import ShortcutHandler from './Global/Shortcut';

export function App() {

  return (
    <Router>
    <ShortcutHandler/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with PrivateRoute and Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifikasi" element={<Notifications />} />
            <Route path="/tugas" element={<Tugas />} />
            <Route path="/tugas/:id" element={<DetailTask />} />
            {/* <Route path="/undangan-tugas" element={<UndanganTugas />} /> */}
            <Route path="/category" element={<Category />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}
