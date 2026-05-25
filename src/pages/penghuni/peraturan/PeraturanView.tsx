import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RuleSection = ({ title, pasal, icon, children }: { title: string, pasal: string, icon: React.ReactNode, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Trik bypass linter untuk menghindari false positive pada aria-expanded dinamis
  const accessibilityProps = {
    "aria-expanded": isOpen,
  };

  return (
    // PERBAIKAN: Hapus mb-4 dari sini agar parent container yang kontrol jaraknya
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        {...accessibilityProps}
        aria-label={`Buka ${title}`}
        title={`Buka ${title}`}
        className="w-full p-5 flex items-center justify-between focus:outline-none bg-white active:bg-gray-50/70 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-50 rounded-[14px] flex items-center justify-center text-indigo-600 shrink-0">
            {icon}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">{pasal}</span>
            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{title}</span>
          </div>
        </div>
        <div className={`text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Konten dengan animasi smooth */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 p-6 border-t border-gray-50 bg-gray-50/40' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="space-y-3.5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PeraturanView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0]">
        
        {/* HEADER PREMIUM */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button 
            onClick={() => navigate('/dashboard')} 
            aria-label="Kembali"
            title="Kembali"
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Peraturan Kost</h1>
        </div>

        {/* UTAMA */}
        <div className="p-6">
          
          {/* Banner Informasi Atas */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex gap-4 items-start mb-6">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shrink-0 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="space-y-1 mt-0.5">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Komitmen Bersama
              </h2>
              <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
                Tata tertib ini dibuat demi kenyamanan, privasi, keamanan, dan ketenteraman seluruh penghuni Mutiara Kost.
              </p>
            </div>
          </div>

          {/* PERBAIKAN: Ubah space-y-1 menjadi space-y-4 untuk jarak rata sempurna */}
          <div className="space-y-4">
            
            {/* PASAL 1 */}
            <RuleSection 
              pasal="PASAL 1" 
              title="Akses Gerbang & Keamanan" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            >
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">1.1.</span>
                <span>Setiap penghuni diberikan fasilitas kunci akses gerbang masing-masing untuk menjaga fleksibilitas aktivitas harian.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">1.2.</span>
                <span>Tidak ada jam malam untuk penutupan gerbang total, namun gerbang wajib selalu dikunci kembali dengan rapat setelah keluar/masuk demi keamanan bersama.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">1.3.</span>
                <span>Harap menjaga ketenangan saat beraktivitas keluar atau masuk area kost pada larut malam agar tidak mengganggu istirahat penghuni lain.</span>
              </div>
            </RuleSection>

            {/* PASAL 2 */}
            <RuleSection 
              pasal="PASAL 2" 
              title="Ketentuan Bertamu" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            >
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">2.1.</span>
                <span>Tamu berkunjung diperbolehkan maksimal hingga pukul <span className="text-indigo-600 font-black">21:00 WIB (Jam 9 Malam)</span>.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">2.2.</span>
                <span>Tamu lawan jenis dilarang keras untuk masuk ke dalam kamar penghuni demi menjaga norma, privasi, dan kenyamanan lingkungan kost.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">2.3.</span>
                <span>Segala bentuk kunjungan menginap (keluarga/kerabat) wajib dilaporkan dan mendapatkan izin dari Admin kost terlebih dahulu.</span>
              </div>
            </RuleSection>

            {/* PASAL 3 */}
            <RuleSection 
              pasal="PASAL 3" 
              title="Fasilitas & Kamar" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            >
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">3.1.</span>
                <span>Penghuni wajib menjaga kebersihan, kerapian, serta keutuhan seluruh fasilitas standar di dalam kamar masing-masing.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">3.2.</span>
                <span>Dilarang mengubah struktur bangunan kamar, mengecat ulang, atau memaku dinding tanpa persetujuan tertulis dari Admin kost.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">3.3.</span>
                <span>Penggunaan perangkat elektronik tambahan yang berdaya listrik besar di luar standar wajib dikoordinasikan kepada pengelola.</span>
              </div>
            </RuleSection>

            {/* PASAL 4 */}
            <RuleSection 
              pasal="PASAL 4" 
              title="Ketertiban Lingkungan" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-4.248-5.74V4a2 2 0 10-3.504 0v1.26A6.07 6.07 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
            >
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">4.1.</span>
                <span>Penghuni dilarang membuat kegaduhan atau kebisingan suara (musik/obrolan) yang mengganggu kenyamanan waktu istirahat penghuni lain.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">4.2.</span>
                <span>Dilarang keras membawa, menyimpan, atau mengonsumsi barang terlarang, zat adiktif, minuman keras, serta senjata tajam di lingkungan kost.</span>
              </div>
              <div className="flex items-start gap-3 text-[12px] font-bold text-gray-600 leading-relaxed">
                <span className="text-indigo-600 font-black shrink-0">4.3.</span>
                <span>Pelanggaran berat terhadap tata tertib atau hukum yang berlaku akan ditindak tegas berupa pemutusan hak sewa secara sepihak tanpa pengembalian dana.</span>
              </div>
            </RuleSection>
          </div>

          {/* FOOTER FORMAL */}
          <div className="mt-8 bg-indigo-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-900/20">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-2 translate-y-2">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Butuh Bantuan?</p>
              <h2 className="text-sm font-black uppercase tracking-tight mb-2">Hubungi Pengelola Kost</h2>
              <p className="text-[11px] font-bold text-indigo-100/80 leading-relaxed">
                Jika melihat pelanggaran ketertiban atau mengalami kendala darurat, harap segera laporkan ke Admin melalui WhatsApp atau menu pelaporan.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}