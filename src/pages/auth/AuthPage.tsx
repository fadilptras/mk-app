import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginView from '../../components/auth/LoginView';
import ForgotPasswordView from '../../components/auth/ForgotPasswordView';
import NewPenghuniView from "../../components/auth/NewPenghuniView";

type AuthView = 'login' | 'forgot-password' | 'new-penghuni';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <AuthLayout>
      {currentView === 'login' && (
        <LoginView
          onForgot={() => setCurrentView('forgot-password')}
          onNewPenghuni={() => setCurrentView('new-penghuni')}
        />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPasswordView onBack={() => setCurrentView('login')} />
      )}
      {currentView === 'new-penghuni' && (
        <NewPenghuniView />
      )}
    </AuthLayout>
  );
}