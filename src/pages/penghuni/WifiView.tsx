import { useState, useEffect } from 'react';
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
  
  // State untuk mengontrol munculnya notifikasi toast
  const [showToast, setShowToast] = useState(false);

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
      // Tampilkan notifikasi custom toast
      setShowToast(true);
      // Sembunyikan otomatis setelah 3 detik
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getWifiQRString = (ssid: string, pass: string) => {
    return `WIFI:T:WPA;S:${ssid};P:${pass};;`;
  };

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0]">
        
        {/* Header Biru Premium */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button 
            onClick={() => navigate('/dashboard')} 
            aria-label="Kembali ke Dashboard"
            title="Kembali"
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
          >
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
              {/* Banner Penjelasan - DITAMPILKAN DI ATAS CARD UTAMA SEBAGAI BAGIAN DARI ALUR UI */}
              <div className="bg-white border border-gray-100 rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex gap-4 items-start mb-6">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shrink-0 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-4.248-5.74V4a2 2 0 10-3.504 0v1.26A6.07 6.07 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="space-y-1 mt-0.5">
                  <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    Cara Terhubung Cepat
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </h2>
                  <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                    Arahkan kamera ponsel atau Google Lens ke kode QR di bawah untuk langsung tersambung otomatis.
                  </p>
                </div>
              </div>

              {/* CARD 1: QR CODE - DIPERBAIKI UNTUK CENTER & PROPORSI */}
              <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 text-center relative overflow-hidden mb-5">
                {/* Blue gradient line on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-t-[32px]"></div>
                
                <div className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-50 inline-block mt-3">
                  <QRCodeSVG 
                    value={getWifiQRString(wifiInfo.ssid, wifiInfo.password)}
                    size={170} 
                    fgColor="#312E81" // Indgo 900 untuk kesan premium
                    style={{ display: "block" }}
                  />
                </div>
                <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mt-6">Pindai Kode Untuk Terhubung</p>
              </div>

              {/* CARD 2: INFORMASI JARINGAN & KATA SANDI */}
              <div className="bg-white rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 text-center">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Nama Jaringan</p>
                    {/* Style user yang diminta, netral dan clean */}
                    <div className="bg-indigo-50/60 py-3.5 px-4 rounded-2xl border border-indigo-100 font-mono font-bold text-lg text-indigo-600 tracking-wider">
                      {wifiInfo.ssid}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Password</p>
                    {/* Style user yang diminta, contrasty and mono for passwrod */}
                    <div className="bg-indigo-50/60 py-3.5 px-4 rounded-2xl border border-indigo-100 font-mono font-bold text-lg text-indigo-600 tracking-wider">
                      {wifiInfo.password}
                    </div>
                  </div>
                </div>

                <button 
                onClick={handleCopy}
                className="w-full mt-6 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  SALIN PASSWORD
                </button>
              </div>
            </>
          ) : null}
        </div>

        {/* Notifikasi Toast (DITAMBAHKAN KEMBALI SEPERTI DI KODE USER ASLI) */}
        <div 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-bold px-6 py-3.5 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center gap-2.5 ${
            showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Password berhasil di salin
        </div>

      </div>
    </div>
  );
}