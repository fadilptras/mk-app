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
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile/edit" element={<ProfileEditView />} />
            <Route path="/dashboard" element={<PenghuniDashboardView />} />
            <Route path="/admin" element={<AdminDashboardView />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;