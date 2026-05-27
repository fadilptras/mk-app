import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../../hooks/useProfileCheck';
import { useKontrak } from '../../../hooks/useKontrak';
import { generateRefID } from '../../../utils/formatId';

export default function FormKontrakView() {
  const navigate = useNavigate();
  const { profileData, loading: profileLoading, refreshProfile } = useProfileCheck();
  const { activeContract, jenisKontrakOtomatis, ajukanKontrak, getRemainingDays, loading: contractLoading } = useKontrak();
  
  const [lamaSewa, setLamaSewa] = useState<number>(0);
  const [mulaiSewa, setMulaiSewa] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const hargaDasar = Number(profileData?.biaya_sewa) || 0;
  const baseDeposit = Number(profileData?.biaya_deposit) || 0;
  const deposit = jenisKontrakOtomatis === 'baru' ? baseDeposit : 0;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  useEffect(() => {
    if (!profileLoading && !contractLoading) {
      const sisaHari = activeContract ? getRemainingDays(activeContract.akhir_sewa) : 0;
      const isUserBaru = !activeContract;
      const isSisaHariValid = activeContract?.status === 'aktif' && sisaHari <= 14;
      
      if (!isUserBaru && !isSisaHariValid && activeContract?.status !== 'menunggu_persetujuan') {
        alert("Akses ditolak! Fitur pengajuan kontrak baru saat ini masih terkunci.");
        navigate('/kontrak');
      }
    }
  }, [activeContract, profileLoading, contractLoading, navigate, getRemainingDays]);

  const handleSimpan = async () => {
    if (lamaSewa === 0 || !mulaiSewa || !isAgreed) return;
    const date = new Date(mulaiSewa);
    date.setMonth(date.getMonth() + lamaSewa);
    const akhirSewa = date.toISOString().split('T')[0];

    const success = await ajukanKontrak(lamaSewa, mulaiSewa, akhirSewa, hargaDasar, deposit);
    
    if (success) {
      alert("Pengajuan Kontrak Berhasil Dikirim!");
      if (refreshProfile) {
        await refreshProfile();
      }
      navigate('/kontrak'); 
    }
  };

  if (profileLoading || contractLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto bg-[#BFDDF0] min-h-screen shadow-inner">
        
        <div className="bg-indigo-600 px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/kontrak')} 
              aria-label="Kembali"
              title="Kembali"
              className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-black text-white tracking-tight">
              Pengajuan {jenisKontrakOtomatis === 'baru' ? 'Sewa Baru' : 'Perpanjangan'}
            </h1>
          </div>
          <button 
            onClick={() => navigate('/kontrak')}
            className="text-[10px] font-black bg-white text-indigo-600 px-3 py-1.5 rounded-full shadow"
          >
            BATAL
          </button>
        </div>

        <div className="p-5 space-y-5">
          {activeContract && (
            <div className="bg-gradient-to-br from-slate-800 to-indigo-950 text-white rounded-3xl p-5 shadow-xl space-y-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Kontrak Aktif Saat Ini</p>
                  {/* PEMBARUAN REF ID INFO KONTRAK AKTIF DI FORM */}
                  <h4 className="text-[11px] font-black font-mono mt-1 text-white">
                    {generateRefID('kontrak', activeContract.id, activeContract.created_at)}
                  </h4>
                </div>
                <span className="text-[9px] bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {activeContract.status}
                </span>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Tanggal Mulai Sewa</p>
                  <p className="font-bold mt-0.5">{new Date(activeContract.mulai_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wide">Akan Berakhir Pada</p>
                  <p className="font-black text-amber-400 mt-0.5">{new Date(activeContract.akhir_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <p className="text-[11px] font-medium text-gray-300">
                  Sisa Waktu Hunian: <strong className="text-white text-xs font-black">{getRemainingDays(activeContract.akhir_sewa)} Hari Lagi</strong>
                </p>
              </div>
            </div>
          )}

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs font-black text-indigo-900 mb-1 tracking-wide uppercase">Petunjuk Pengisian</h2>
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                {jenisKontrakOtomatis === 'baru' 
                  ? 'Isi konfigurasi sewa awal hunian Anda. Tarif deposit wajib dibayarkan bersama komponen sewa utama bulan pertama.'
                  : 'Sesuai kesepakatan sistem Mutiara Kost, pengajuan perpanjangan hanya akan membebankan tarif sewa kamar murni tanpa tambahan deposit baru.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">Identitas Penghuni</h2>
            </div>
            <div className="space-y-2.5 text-xs font-medium text-gray-700">
              <div className="flex justify-between"><span className="text-gray-400">Nama Lengkap</span><span className="font-black text-gray-900">{profileData?.nama_lengkap || profileData?.full_name || '-'}</span></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between"><span className="text-gray-400">NIK / KTP</span><span>{profileData?.nik || '-'}</span></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between"><span className="text-gray-400">Kamar</span><span className="font-black text-indigo-600">Kamar {profileData?.room_number || '-'}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-4">Rincian Komponen Kamar</h2>
            <div className="space-y-2.5 text-xs font-medium text-gray-700">
              <div className="flex justify-between"><span className="text-gray-400">Harga Sewa Bulanan</span><span className="font-black text-gray-900">{formatRupiah(hargaDasar)}</span></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between"><span className="text-gray-400">Biaya Deposit Tagihan</span><span className="font-black text-gray-900">{formatRupiah(deposit)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-4">Konfigurasi Jangka Waktu</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="mulai_sewa_input" className="text-[10px] font-black text-gray-500 uppercase ml-0.5">Tanggal Mulai Sewa</label>
                <input id="mulai_sewa_input" type="date" value={mulaiSewa} onChange={(e) => setMulaiSewa(e.target.value)} className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1">
                <label htmlFor="lama_sewa_input" className="text-[10px] font-black text-gray-500 uppercase ml-0.5">Durasi Sewa (Bulan)</label>
                <select id="lama_sewa_input" value={lamaSewa} onChange={(e) => setLamaSewa(Number(e.target.value))} className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all">
                  <option value={0} disabled>Pilih Jangka Waktu</option>
                  <option value={1}>1 Bulan Sewa</option>
                  <option value={3}>3 Bulan Sewa</option>
                  <option value={6}>6 Bulan Sewa</option>
                  <option value={12}>1 Tahun Penuh (12 Bulan)</option>
                </select>
              </div>
            </div>
          </div>

          {lamaSewa > 0 && (
            <div className="bg-indigo-600 rounded-[24px] p-5 text-white shadow-xl relative overflow-hidden">
              <h2 className="text-xs font-black text-indigo-100 uppercase tracking-wide mb-3">Estimasi Akumulasi Awal</h2>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-indigo-200">Total Komponen Biaya</span>
                <span className="text-base font-black">{formatRupiah((hargaDasar * lamaSewa) + deposit)}</span>
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/40 space-y-4 shadow-sm">
            <label htmlFor="syarat_ketentuan_checkbox" className={`flex items-start gap-3 p-2 rounded-xl border-2 transition-all cursor-pointer ${isAgreed ? 'bg-indigo-50/60 border-indigo-300' : 'border-transparent'}`} onClick={(e) => { e.preventDefault(); setIsAgreed(!isAgreed); }}>
              <input id="syarat_ketentuan_checkbox" type="checkbox" checked={isAgreed} readOnly className="mt-0.5 w-4 h-4 text-indigo-600" />
              <span className="text-[11px] text-gray-700 leading-snug font-black">Saya menyetujui seluruh ketentuan sewa menyewa di Mutiara Kost.</span>
            </label>
            <button 
              disabled={lamaSewa === 0 || !mulaiSewa || !isAgreed} 
              onClick={handleSimpan} 
              className={`w-full text-white text-xs font-black py-4 rounded-xl transition-all uppercase tracking-widest ${lamaSewa > 0 && mulaiSewa && isAgreed ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              AJUKAN KONTRAK SEKARANG
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}