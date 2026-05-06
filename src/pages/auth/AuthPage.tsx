import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginView from '../../components/auth/LoginView';
import ForgotPasswordView from '../../components/auth/ForgotPasswordView';
import { NewTenantView } from '../../components/auth/NewTenantView';
import { loginUser } from '../../lib/auth';

type AuthView = 'login' | 'forgot-password' | 'new-tenant';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const hasBack = currentView !== 'login';

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
    <AuthLayout
      view={currentView}
      onBack={hasBack ? () => setCurrentView('login') : undefined}
    >
      {currentView === 'login' && (
        <LoginView
          onLogin={handleLogin}
          onForgot={() => setCurrentView('forgot-password')}
          onNewTenant={() => setCurrentView('new-tenant')}
        />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPasswordView onBack={() => setCurrentView('login')} />
      )}
      {currentView === 'new-tenant' && (
        <NewTenantView onBackToLogin={() => setCurrentView('login')} />
      )}
    </AuthLayout>
  );
}
