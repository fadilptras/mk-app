import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginView from '../../components/auth/LoginView'; 
import ForgotPasswordView from '../../components/auth/ForgotPasswordView';
import { NewTenantView } from '../../components/auth/NewTenantView'; 

type AuthView = 'login' | 'forgot-password' | 'new-tenant';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  // Dinamis ganti judul AuthLayout sesuai halaman
  let title = '';
  let subtitle = '';
  let icon = '';

  if (currentView === 'login') {
    title = 'Mutiara Kost';
    subtitle = 'Portal Penghuni & Admin';
    icon = '🏠';
  } else if (currentView === 'forgot-password') {
    title = 'Reset Password';
    subtitle = 'Bantuan Akses Akun';
    icon = '🔐';
  } else if (currentView === 'new-tenant') {
    title = 'Aktivasi Akun';
    subtitle = 'Penghuni Baru Mutiara Kost';
    icon = '✨';
  }

  return (
    <AuthLayout title={title} subtitle={subtitle} icon={icon}>
      {currentView === 'login' && (
        <LoginView 
          onForgot={() => setCurrentView('forgot-password')} 
          onNewTenant={() => setCurrentView('new-tenant')}
          onLogin={(email: string, pass: string) => {
             // Handle login logic di sini
             console.log(email, pass);
          }}
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