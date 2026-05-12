// src/pages/penghuni/LaporView.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LaporView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ kategori: 'Kerusakan Fasilitas', deskripsi: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Nanti tambahkan logika supabase.from('reports').insert() di sini
    setTimeout(() => {
      setLoading(false);
      alert('Laporan berhasil dikirim ke Admin! Kami akan segera menindaklanjutinya.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-gray-800">Lapor Keluhan</h1>
        </div>

        <div className="p-5">
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-6 flex gap-3 items-start">
            <span className="text-xl">🛠️</span>
            <div>
              <h2 className="text-xs font-black text-rose-800 uppercase mb-1">Pusat Bantuan</h2>
              <p className="text-[10px] font-medium text-rose-600 leading-relaxed">
                Ada AC bocor, lampu mati, atau masalah keamanan? Laporkan di sini, admin akan mengecek maksimal 1x24 Jam.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Kategori Masalah</label>
              <select 
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-rose-500 outline-none appearance-none"
                value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              >
                <option value="Kerusakan Fasilitas">Kerusakan Fasilitas (AC, Lampu, dll)</option>
                <option value="Kebersihan">Kebersihan Area Kost</option>
                <option value="Keamanan">Masalah Keamanan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Jelaskan Detail Kendala</label>
              <textarea 
                required rows={4} placeholder="Contoh: AC kamar A-01 tidak dingin dan meneteskan air sejak semalam..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              ></textarea>
            </div>

            {/* Area Upload Foto Opsional */}
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-2">Lampirkan Foto (Opsional)</label>
               <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center text-gray-400 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer">
                 <span className="text-xl mb-1 block">📸</span>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Ketuk untuk upload foto</span>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black py-4 rounded-xl shadow-lg shadow-pink-500/30 active:scale-95 transition-all mt-4 disabled:opacity-50">
              {loading ? 'MENGIRIM...' : 'KIRIM LAPORAN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}