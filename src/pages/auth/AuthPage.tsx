import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginView from '../../components/auth/LoginView';
import ForgotPasswordView from '../../components/auth/ForgotPasswordView';
import NewPenghuniView from "../../components/auth/NewPenghuniView";
import { loginUser } from '../../lib/auth';

type AuthView = 'login' | 'forgot-password' | 'new-penghuni';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      console.log('Login berhasil:', user);
      // TODO: Redirect ke dashboard atau set auth state
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AuthLayout>
      {currentView === 'login' && (
        <LoginView
          onLogin={handleLogin}
          onForgot={() => setCurrentView('forgot-password')}
          onNewPenghuni={() => setCurrentView('new-penghuni')}
        />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPasswordView onBack={() => setCurrentView('login')} />
      )}
      {currentView === 'new-penghuni' && (
        // 2. Hapus props onBackToLogin dari NewPenghuniView
        <NewPenghuniView />
      )}
    </AuthLayout>
  );
}