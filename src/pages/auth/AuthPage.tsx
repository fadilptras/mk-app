import { useState } from 'react';
import AuthLayout from "../../components/auth/AuthLayout";
import LoginView from "../../components/auth/LoginView";
import ForgotPasswordView from "../../components/auth/ForgotPasswordView";

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'forgot'>('login');

  const handleLogin = (email: string, password: string) => {
    console.log(email, password);
  };

  return (
    <>
      {view === 'login' && (
        <AuthLayout
          title="Mutiara Kost"
          subtitle="Manajemen kost modern & mudah"
          icon="🏠"
        >
          <LoginView
            onLogin={handleLogin}
            onForgot={() => setView('forgot')}
          />
        </AuthLayout>
      )}

      {view === 'forgot' && (
        <AuthLayout
          title="Lupa Password"
          subtitle="Reset password melalui admin"
          icon="🔒"
        >
          <ForgotPasswordView
            onBack={() => setView('login')}
          />
        </AuthLayout>
      )}
    </>
  );
}