import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import MobileLayout from "./components/layout/MobileLayout";
import AuthPage from "./pages/penghuni/auth/AuthPage";

// Penghuni / user
import ProfileEditView from "./pages/penghuni/profile/ProfileEditView";
import PenghuniDashboardView from "./pages/penghuni/dashboard/PenghuniDashboardView";
import SewaView from "./pages/penghuni/sewa/SewaView";
import WifiView from "./pages/penghuni/wifi/WifiView";
import ListrikView from "./pages/penghuni/listrik/ListrikView";
import LaporView from "./pages/penghuni/lapor/LaporView";
import NotificationView from "./pages/penghuni/notifikasi/NotificationView";
import PeraturanView from "./pages/penghuni/peraturan/PeraturanView";
import KontrakDashboardView from "./pages/penghuni/kontrak/KontrakDashboardView";
import FormKontrakView from "./pages/penghuni/kontrak/FormKontrakView";
import FormBayarView from "./pages/penghuni/sewa/FormBayarView";
import DetailBayarView from "./pages/penghuni/sewa/DetailRiwayatPembayaran";

// Admin
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboardView from "./pages/admin/dashboard/AdminDashboardView";
import KelolaKamarView from "./pages/admin/man-kamar/KelolaKamarView";
import KelolaPenghuniView from "./pages/admin/man-penghuni/KelolaPenghuniView";
import SetListrikView from "./pages/admin/man-listrik/SetListrikView";
import SetWifiView from "./pages/admin/man-wifi/SetWifiView";
import KelolaLaporanView from "./pages/admin/man-lapor/KelolaLaporanView";
import KelolaTagihanView from "./pages/admin/man-sewa/KelolaTagihanView";
import KelolaKontrakView from "./pages/admin/man-kontrak/KelolaKontrakView";
import DetailKontrakView from "./pages/admin/man-kontrak/DetailKontrakView";
import DetailTagihanView from "./pages/admin/man-sewa/DetailTagihanView";
import KirimPengumumanView from "./pages/admin/man-pengumuman/KirimPengumumanView";

function App() {
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Rute Terproteksi (Harus Login) */}
          <Route element={<ProtectedRoute />}>
            {/* ====== ROUTE PENGHUNI ====== */}
            <Route path="/profile/edit" element={<ProfileEditView />} />
            <Route path="/dashboard" element={<PenghuniDashboardView />} />
            <Route path="/sewa" element={<SewaView />} />
            <Route path="/wifi" element={<WifiView />} />
            <Route path="/listrik" element={<ListrikView />} />
            <Route path="/lapor" element={<LaporView />} />
            <Route path="/notifications" element={<NotificationView />} />
            <Route path="/peraturan" element={<PeraturanView />} />
            <Route path="/kontrak" element={<KontrakDashboardView />} />
            <Route path="/kontrak/perpanjang" element={<FormKontrakView />} />
            <Route path="/sewa/bayar" element={<FormBayarView />} />
            <Route path="/sewa/detail/:id" element={<DetailBayarView />} />

            {/* ====== ROUTE ADMIN ====== */}
            {/* Hapus Route /admin mandiri, pindahkan semua ke dalam AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* index = default route saat user akses /admin */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardView />} />
              <Route path="kamar" element={<KelolaKamarView />} />
              <Route path="penghuni" element={<KelolaPenghuniView />} />
              <Route path="listrik" element={<SetListrikView />} />
              <Route path="wifi" element={<SetWifiView />} />
              <Route path="laporan" element={<KelolaLaporanView />} />
              <Route path="tagihan" element={<KelolaTagihanView />} />
              <Route path="kontrak" element={<KelolaKontrakView />} />
              <Route path="kontrak/:id" element={<DetailKontrakView />} />
              <Route path="tagihan/:id" element={<DetailTagihanView />} />
              <Route path="pengumuman" element={<KirimPengumumanView />} />
            </Route>
          </Route>

          {/* Catch-all route (404 Fallback) */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;
