import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WifiView() {
  const navigate = useNavigate();
  const [wifi] = useState({ ssid: 'Mutiara_Kost_Lt1', password: 'mutiarabersama' });

  const qrData = `WIFI:S:${wifi.ssid};T:WPA;P:${wifi.password};;`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&color=4F46E5`;

  const handleCopy = () => {
    navigator.clipboard.writeText(wifi.password);
    alert('Password WiFi berhasil disalin!');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm border-b border-gray-50">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-50 rounded-full">
             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Akses WiFi</h1>
        </div>

        <div className="p-6">
          {/* Penjelasan di bagian atas */}
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl mb-8">
            <h2 className="text-sm font-black text-indigo-900 uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Cara Terhubung Cepat
            </h2>
            <p className="text-[11px] font-bold text-indigo-700/80 leading-relaxed uppercase">
              Buka kamera ponsel Anda atau aplikasi Google Lens, lalu arahkan ke kode QR di bawah untuk terhubung secara otomatis tanpa perlu memasukkan kata sandi.
            </p>
          </div>

          <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
            
            <div className="bg-white p-4 rounded-[32px] shadow-sm border border-gray-50 inline-block mb-8 mt-2">
              <img src={qrUrl} alt="WiFi QR Code" className="w-44 h-44 mx-auto" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Jaringan</p>
                <div className="bg-gray-50 py-3 px-4 rounded-2xl border border-gray-100 font-black text-gray-800 tracking-tight">
                  {wifi.ssid}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kata Sandi</p>
                <div className="bg-indigo-50/50 py-4 px-4 rounded-2xl border-2 border-indigo-100 font-mono font-black text-2xl text-indigo-600 tracking-wider">
                  {wifi.password}
                </div>
              </div>
            </div>

            <button 
              onClick={handleCopy}
              className="w-full mt-8 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              SALIN PASSWORD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}