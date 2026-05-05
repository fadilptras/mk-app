import { useState } from 'react';

export default function LoginView({ onLogin, onForgot }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">
        Selamat datang kembali
      </h2>
      <p className="text-gray-500 mb-4">
        Masuk ke akunmu untuk melanjutkan
      </p>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="contoh@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-xl border mb-3"
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Masukkan password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-xl border mb-2"
      />

      {/* FORGOT */}
      <div className="text-right mb-4">
        <button
          onClick={onForgot}
          className="text-blue-600 text-sm"
        >
          Lupa password?
        </button>
      </div>

      {/* LOGIN BUTTON */}
      <button
        onClick={() => onLogin(email, password)}
        className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700"
      >
        Masuk
      </button>

      <div className="text-center my-4 text-gray-400">atau</div>

      {/* REGISTER */}
      <button className="w-full border border-blue-600 text-blue-600 p-3 rounded-xl font-semibold">
        Saya penghuni baru
      </button>
    </>
  );
}