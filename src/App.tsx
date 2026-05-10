import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from './components/layout/MobileLayout';
import AuthPage from "./pages/auth/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;