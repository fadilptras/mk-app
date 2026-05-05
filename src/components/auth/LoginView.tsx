import { useState } from 'react';

export default function LoginView({ onLogin, onForgot, onNewTenant }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-4">
      {/* EMAIL */}
      <div className="relative">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white focus:outline-none transition-all"
        />
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white focus:outline-none transition-all"
        />
      </div>

      {/* FORGOT PASSWORD */}
      <div className="text-center mt-2 mb-6">
        <button onClick={onForgot} className="text-sm text-white/80 hover:text-white transition">
          Lupa password?
        </button>
      </div>

      {/* LOGIN BUTTON - Cyan Terang */}
      <button
        onClick={() => onLogin(email, password)}
        className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] text-[#041533] py-4 rounded-full text-sm font-extrabold tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,212,255,0.4)]"
      >
        Login
      </button>

      {/* SEPARATOR */}
      <div className="flex items-center gap-4 py-4">
          <div className="h-[1px] flex-1 bg-white/20"></div>
          <span className="text-xs text-white/50 uppercase tracking-widest">Sign Up</span>
          <div className="h-[1px] flex-1 bg-white/20"></div>
      </div>

      {/* REGISTER BUTTON - Border Outline */}
      <button 
        onClick={onNewTenant}
        className="w-full border-2 border-white/50 text-white py-4 rounded-full text-sm font-bold hover:bg-white/10 transition-all uppercase tracking-wider"
      >
        Saya Penghuni Baru
      </button>
    </div>
  );
}