import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// 1. Definisikan props yang diterima dari AuthPage
interface LoginViewProps {
  onForgot: () => void;
  onNewPenghuni: () => void;
  onLogin?: (email: string, pass: string) => void; // Opsional jika kamu pakai fungsi login dari luar
}

// 2. Tangkap props di dalam komponen
export default function LoginView({ onForgot, onNewPenghuni, onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Jika kamu tetap mau pakai useAuth hook yang kita buat:
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Jika ada props onLogin dari AuthPage, gunakan itu. 
    // Jika tidak, gunakan dari useAuth.
    if (onLogin) {
      await onLogin(email, password);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Masuk ke Akun</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com" 
            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all font-medium bg-gray-50"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            {/* 3. Pasang onClick={onForgot} di sini */}
            <button 
              type="button"
              className="text-sm font-bold text-blue-600 hover:underline"
              onClick={onForgot}
            >
              Lupa?
            </button>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all font-medium bg-gray-50"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full h-12 mt-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {loading ? 'Memverifikasi...' : 'Masuk'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-gray-500">
          Penghuni baru?{' '}
          {/* 4. Pasang onClick={onNewPenghuni} di sini */}
          <button 
            type="button" 
            onClick={onNewPenghuni}
            className="text-blue-600 font-bold hover:underline"
          >
            Aktivasi di sini
          </button>
        </p>
      </div>
    </div>
  );
}