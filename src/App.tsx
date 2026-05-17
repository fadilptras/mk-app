import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from './components/layout/MobileLayout';
import AuthPage from "./pages/auth/AuthPage";
import ProfileEditView from "./pages/profile/ProfileEditView";
import PenghuniDashboardView from "./pages/penghuni/PenghuniDashboardView";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Import Halaman Fitur Penghuni
import SewaView from './pages/penghuni/SewaView';
import WifiView from './pages/penghuni/WifiView';
import ListrikView from './pages/penghuni/ListrikView';
import LaporView from './pages/penghuni/LaporView';
import NotificationView from './pages/penghuni/NotificationView';
import PeraturanView from './pages/penghuni/PeraturanView';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardView from './pages/admin/AdminDashboardView';
import KelolaKamarView from './pages/admin/KelolaKamarView';
import KelolaPenghuniView from './pages/admin/KelolaPenghuniView';
import SetListrikView from './pages/admin/SetListrikView';
import SetWifiView from './pages/admin/SetWifiView';
import KelolaLaporanView from './pages/admin/KelolaLaporanView';

function App() {
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Rute Terproteksi (Harus Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/edit" element={<ProfileEditView />} />
            <Route path="/dashboard" element={<PenghuniDashboardView />} />
            <Route path="/admin" element={<AdminDashboardView />} />
            
            {/* Rute Fitur Mutiara Kost */}
            <Route path="/sewa" element={<SewaView />} />
            <Route path="/wifi" element={<WifiView />} />
            <Route path="/listrik" element={<ListrikView />} />
            <Route path="/lapor" element={<LaporView />} />
            <Route path="/notifications" element={<NotificationView />} />
            <Route path="/peraturan" element={<PeraturanView />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth" replace />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardView />} />
            <Route path="dashboard" element={<AdminDashboardView />} />
            <Route path="kamar" element={<KelolaKamarView />} />
            <Route path="penghuni" element={<KelolaPenghuniView />} />
            <Route path="listrik" element={<SetListrikView />} />
            <Route path="wifi" element={<SetWifiView />} />
            <Route path="laporan" element={<KelolaLaporanView />} />
          </Route>
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;