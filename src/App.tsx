import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from './components/layout/MobileLayout';
import AuthPage from "./pages/auth/AuthPage";
import ProfileEditView from "./pages/profile/ProfileEditView";
import AdminDashboardView from "./pages/admin/AdminDashboardView";
import PenghuniDashboardView from "./pages/penghuni/PenghuniDashboardView";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      {/* MobileLayout memastikan aplikasi selalu terbingkai seukuran HP */}
      <MobileLayout>
        <Routes>
          {/* --- RUTE PUBLIK --- */}
          {/* Mengarahkan halaman utama langsung ke login */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* --- RUTE TERPROTEKSI (Wajib Login) --- */}
          <Route element={<ProtectedRoute />}>
            {/* Halaman Lengkapi Profil (Muncul jika is_profile_complete = false) */}
            <Route path="/profile/edit" element={<ProfileEditView />} />
            
            {/* Dashboard Utama untuk Penghuni */}
            <Route path="/dashboard" element={<PenghuniDashboardView />} />
            
            {/* Panel Khusus untuk Admin */}
            <Route path="/admin" element={<AdminDashboardView />} />
          </Route>

          {/* Fallback jika rute tidak ditemukan */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;