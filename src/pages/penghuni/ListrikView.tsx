import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const StepGuide = ({ number, title, description, highlight }: { number: string, title: string, description: string, highlight?: string }) => (
  <div className="flex gap-4 items-start relative pb-6 last:pb-0">
    <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-indigo-200/60 last:hidden"></div>
    
    <div className="relative z-10 w-8 h-8 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-[12px] font-black text-indigo-900">{number}</span>
    </div>
    
    <div className="pt-1.5 space-y-1.5 flex-1">
      <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{title}</h4>
      <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
        {description}
      </p>
      {highlight && (
        <div className="mt-2.5 bg-indigo-50 px-3.5 py-2.5 rounded-xl border border-indigo-200">
          <p className="text-[10px] font-black text-indigo-900 leading-snug uppercase tracking-wide">
            {highlight}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default function ListrikView() {
  const navigate = useNavigate();
  const [meterInfo, setMeterInfo] = useState<{ meter_number: string, meter_name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeterData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      
      const userId = authData.user?.id;
      if (!userId) throw new Error("Sesi pengguna tidak ditemukan.");

      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('meter_number, meter_name')
        .eq('current_tenant_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data && data.meter_number) {
        setMeterInfo({
          meter_number: data.meter_number,
          meter_name: data.meter_name || "Tidak ada nama",
        });
      } else {
        setError('Data meteran untuk kamar Anda belum dikonfigurasi oleh Admin.');
      }
    } catch (err: any) {
      console.error('Error fetching meter data:', err);
      setError('Gagal memuat data meteran. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeterData();
  }, []);

  const handleCopy = () => {
    if (meterInfo?.meter_number) {
      navigator.clipboard.writeText(meterInfo.meter_number);
      alert('Nomor meteran berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0]">
        
        {/* Header Biru Premium */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Token Listrik</h1>
        </div>

        <div className="p-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-12 mt-10">
               <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Data...</p>
             </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-5 rounded-[32px] mt-4 text-center">
              <p className="text-[11px] font-bold text-red-800 leading-relaxed uppercase mb-3">
                {error}
              </p>
              <button 
                onClick={fetchMeterData}
                className="bg-red-100 text-red-800 text-[10px] font-black py-2 px-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform"
              >
                Coba Lagi
              </button>
            </div>
          ) : meterInfo ? (
            <>
              {/* Banner Penjelasan - Elegan & Kontras Tinggi */}
              <div className="bg-white border border-gray-100 rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex gap-4 items-start mb-6">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shrink-0 flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="space-y-1 mt-0.5">
                  <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    Informasi Meteran
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </h2>
                  <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                    Pastikan nama yang tertera saat pembelian token di aplikasi sesuai dengan nama di bawah ini.
                  </p>
                </div>
              </div>

              {/* Data Meteran Card */}
              <div className="bg-white rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-gray-100 text-center relative overflow-hidden mb-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nama Terdaftar</p>
                    <div className="bg-indigo-50 py-3.5 px-4 rounded-2xl border border-indigo-200 font-mono font-black text-2xl text-indigo-900 tracking-wider">
                      {meterInfo.meter_name}
                    </div>
                  </div>

                <div className="space-y-5 mt-2">
                <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">No. Meteran (ID Pelanggan)</p>
                    <div className="bg-indigo-50 py-3.5 px-4 rounded-2xl border border-indigo-200 font-mono font-black text-2xl text-indigo-900 tracking-wider">
                      {meterInfo.meter_number}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCopy}
                  className="w-full mt-6 bg-indigo-600 text-white font-black py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Salin Nomor
                </button>
              </div>

              {/* Panduan Pengisian */}
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5 ml-1 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Cara Pengisian Cepat
                </h3>
                
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                   <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
                   
                   <div className="relative z-10">
                     <StepGuide 
                        number="1" 
                        title="Beli Token" 
                        description="Buka m-banking/e-wallet, pilih menu Listrik PLN > Token Listrik. Masukkan nomor meteran di atas."
                     />
                     <StepGuide 
                        number="2" 
                        title="Dapatkan Kode" 
                        description="Selesaikan pembayaran. Anda akan menerima 20 digit angka token."
                        highlight="Catat atau simpan 20 digit kode tersebut."
                     />
                     <StepGuide 
                        number="3" 
                        title="Input Fisik" 
                        description="Ketik 20 digit angka pada keypad meteran fisik di depan kamar, lalu tekan tombol 'Enter' (merah/hijau)."
                        highlight="Jika muncul 'ACCEPT' / 'BENAR', daya berhasil bertambah."
                     />
                   </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}