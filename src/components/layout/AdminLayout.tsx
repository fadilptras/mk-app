import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin');

  const menus = [
    { name: 'Beranda', path: '/admin/dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { name: 'Data Kamar', path: '/admin/kamar', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
    { name: 'Penghuni', path: '/admin/penghuni', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { name: 'Laporan Masuk', path: '/admin/laporan', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { name: 'Listrik (Token)', path: '/admin/listrik', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { name: 'Akses WiFi', path: '/admin/wifi', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /> },
  ];

  return (
    <div className="min-h-screen bg-[#E6EEF4] font-sans text-slate-800 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-[#F0F4F8] relative flex flex-col shadow-[0_0_60px_rgba(13,47,92,0.07)] overflow-hidden">
        
        {isSidebarOpen && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1.5px] z-40 transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />
        )}

        <aside className={`absolute top-0 left-0 h-full w-[260px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[#7A93B5] text-[10px] font-black uppercase tracking-wider mb-0.5">Navigasi Utama</p>
              <h2 className="text-lg font-black text-[#0D2F5C] tracking-tight">Mutiara Kost</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} aria-label="Tutup Menu" className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menus.map((menu) => {
              const active = isActive(menu.path);
              return (
                <button key={menu.path} onClick={() => { navigate(menu.path); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0D2F5C]'}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">{menu.icon}</svg>{menu.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <header className="bg-white border-b border-slate-100 px-5 pt-8 pb-5 relative z-10 flex justify-between items-center shadow-[0_2px_15px_rgba(13,47,92,0.01)]">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} aria-label="Buka Menu" className="text-[#0D2F5C] p-2.5 -ml-2 rounded-xl bg-[#F0F4F8] border border-slate-200/40 hover:bg-slate-200/50 transition-colors active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h11" /></svg>
            </button>
            <div className="ml-1">
              <h1 className="text-base font-black text-[#0D2F5C] tracking-tight uppercase">Mutiara Kost</h1>
              <p className="text-[9px] font-black text-[#7A93B5] uppercase tracking-widest mt-0.5">Management Panel</p>
            </div>
          </div>
          <button onClick={handleLogout} aria-label="Keluar Aplikasi" className="bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-95">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}