import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../../lib/supabase';

interface WifiNetwork {
  id: string;
  ssid: string;
  password: string;
  is_active: boolean;
}

export default function WifiView() {
  const navigate = useNavigate();
  const [wifiInfo, setWifiInfo] = useState<WifiNetwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWifiData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('wifi_networks')
        .select('id, ssid, password, is_active')
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setWifiInfo(data);
      } else {
        setError('Belum ada jaringan WiFi aktif yang dikonfigurasi.');
      }
    } catch (err: any) {
      console.error('Error fetching wifi data:', err);
      setError('Gagal memuat data WiFi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWifiData();
  }, []);

  const handleCopy = () => {
    if (wifiInfo) {
      navigator.clipboard.writeText(wifiInfo.password);
      alert('Password WiFi berhasil disalin!');
    }
  };

  const getWifiQRString = (ssid: string, pass: string) => {
    return `WIFI:T:WPA;S:${ssid};P:${pass};;`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        
        {/* Header Biru Premium */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Akses WiFi</h1>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 mt-10">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Jaringan...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-5 rounded-[32px] mt-4 text-center">
              <p className="text-[11px] font-bold text-red-700/80 leading-relaxed uppercase mb-3">
                {error}
              </p>
              <button 
                onClick={fetchWifiData}
                className="bg-red-100 text-red-700 text-[10px] font-black py-2 px-4 rounded-xl uppercase tracking-widest"
              >
                Coba Lagi
              </button>
            </div>
          ) : wifiInfo ? (
            <>
              {/* Banner Penjelasan - Elegan & Kontras Tinggi */}
              <div className="bg-indigo-50/80 border border-indigo-100/80 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex gap-3.5 items-start mb-8">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-4.248-5.74V4a2 2 0 10-3.504 0v1.26A6.07 6.07 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-[11px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    Cara Terhubung Cepat
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </h2>
                  <p className="text-[10px] font-bold text-indigo-900/80 leading-normal uppercase">
                    Arahkan kamera ponsel atau Google Lens ke kode QR di bawah untuk langsung tersambung otomatis tanpa mengetik password.
                  </p>
                </div>
              </div>

              {/* Card Utama */}
              <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                
                <div className="bg-white p-4 rounded-[32px] shadow-sm border border-gray-50 inline-block mb-8 mt-2">
                  <QRCodeSVG 
                    value={getWifiQRString(wifiInfo.ssid, wifiInfo.password)}
                    size={176} 
                    fgColor="#4F46E5" 
                    style={{ display: "block" }}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Jaringan</p>
                    <div className="bg-gray-50 py-3 px-4 rounded-2xl border border-gray-100 font-black text-gray-800 tracking-tight">
                      {wifiInfo.ssid}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kata Sandi</p>
                    <div className="bg-indigo-50/50 py-4 px-4 rounded-2xl border-2 border-indigo-100 font-mono font-black text-2xl text-indigo-600 tracking-wider">
                      {wifiInfo.password}
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
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}