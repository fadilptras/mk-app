import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { useKontrak } from '../../hooks/useKontrak';
import ContractPDFTemplate from '../../components/penghuni/ContractPDFTemplate';
import html2pdf from 'html2pdf.js';

export default function KontrakDashboardView() {
  const navigate = useNavigate();
  const { profileData, loading: profileLoading } = useProfileCheck();
  const { activeContract, contractHistory, getRemainingDays, loading: contractLoading } = useKontrak();
  
  const [isExporting, setIsExporting] = useState(false);
  const [contractToPrint, setContractToPrint] = useState<any>(null);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'aktif': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'menunggu_persetujuan': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'ditolak': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'selesai': return 'bg-slate-100 border-slate-300 text-slate-700';
      case 'dibatalkan': return 'bg-purple-50 border-purple-200 text-purple-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aktif': return 'Aktif Terverifikasi';
      case 'menunggu_persetujuan': return 'Menunggu Verifikasi';
      case 'ditolak': return 'Ditolak';
      case 'selesai': return 'Selesai / Arsip';
      case 'dibatalkan': return 'Dibatalkan';
      default: return status;
    }
  };

  const handleExportPDF = (contract: any) => {
    setIsExporting(true);
    setContractToPrint(contract);

    setTimeout(() => {
      const element = document.getElementById('pdf-document-content');
      if (!element) {
        setIsExporting(false);
        return;
      }
      
      const opt = {
        margin: [12, 12, 12, 12] as [number, number, number, number],
        filename: `Kontrak_MK_${contract.id.split('-')[0].toUpperCase()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 }, // DIPERBAIKI: Type assertion "as const"
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        setIsExporting(false);
        setContractToPrint(null);
      }).catch((err: any) => {
        console.error("Export Error:", err);
        setIsExporting(false);
        setContractToPrint(null);
      });
    }, 400);
  };

  if (profileLoading || contractLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const sisaHari = activeContract ? getRemainingDays(activeContract.akhir_sewa) : 0;
  const isUserBaru = !activeContract;
  const isSisaHariValid = activeContract?.status === 'aktif' && sisaHari <= 14;
  const canRenew = isUserBaru || isSisaHariValid;

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-slate-800 pb-12 relative overflow-x-hidden shadow-inner">
      
      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white mb-3"></div>
          <h2 className="text-sm font-bold tracking-wide">Mengunduh Dokumen Kontrak...</h2>
        </div>
      )}

      {/* STICKY NAVBAR PREMIUM (SINKRON DENGAN SEWAVIEW) */}
      <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
        <button 
          onClick={() => navigate('/sewa')} 
          title="Kembali ke Halaman Sewa"
          className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-black text-white tracking-tight">Manajemen Kontrak</h1>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        
        {/* DETAIL KONTRAK YANG SEDANG BERJALAN */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-wider pl-1">Kontrak Berjalan</h2>
          
          {activeContract ? (
            <div className="bg-white rounded-[24px] shadow-lg shadow-indigo-900/10 border border-white overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide border ${getStatusBadgeClass(activeContract.status)} bg-white`}>
                  {getStatusLabel(activeContract.status)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  REG-{activeContract.id.split('-')[0].toUpperCase()}
                </span>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-5 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Mulai Sewa</p>
                    <p className="font-black text-slate-800 mt-0.5">{formatDate(activeContract.mulai_sewa)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Akhir Sewa</p>
                    <p className="font-black text-slate-800 mt-0.5">{formatDate(activeContract.akhir_sewa)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Durasi Huni</p>
                    <p className="font-black text-slate-800 mt-0.5">{activeContract.lama_sewa} Bulan</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tarif Kamar</p>
                    <p className="font-black text-indigo-600 mt-0.5">{formatRupiah(activeContract.harga_per_bulan)}/bln</p>
                  </div>
                </div>

                {activeContract.status === 'aktif' && (
                  <div className="mb-5 bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100/50 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-700">Sisa Masa Aktif</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Berakhir secara berkala</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-indigo-600">{sisaHari}</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">Hari</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => handleExportPDF(activeContract)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    UNDUH PDF KONTRAK
                  </button>
                  <button 
                    disabled={!canRenew}
                    onClick={() => navigate('/kontrak/perpanjang')}
                    className={`w-full text-xs font-black py-3.5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 ${
                      canRenew 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    }`}
                  >
                    {isUserBaru ? 'Buat Kontrak Pertama' : 'Ajukan Perpanjangan'}
                  </button>
                </div>
                
                {!canRenew && activeContract.status === 'aktif' && (
                  <p className="text-[10px] text-center text-slate-400 mt-3 font-semibold italic">
                    Fitur perpanjangan terbuka otomatis pada H-14 masa sewa habis.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-[24px] border border-dashed border-slate-300 text-center shadow-md">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase mb-1">Belum Ada Kontrak</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">Kamu terdeteksi belum memiliki ikatan sewa digital resmi.</p>
              <button 
                onClick={() => navigate('/kontrak/perpanjang')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black py-3 px-5 rounded-xl transition-all uppercase tracking-wide"
              >
                Buat Kontrak Pertama
              </button>
            </div>
          )}
        </section>

        {/* RIWAYAT ARSIP KONTRAK LAMA */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-wider pl-1">Arsip Riwayat</h2>
          
          {contractHistory && contractHistory.length > 0 ? (
            <div className="space-y-2.5">
              {contractHistory.map((contract: any) => (
                <div key={contract.id} className="bg-white p-4 rounded-2xl border border-white shadow-sm flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${getStatusBadgeClass(contract.status)} bg-white`}>
                        {getStatusLabel(contract.status)}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">REG-{contract.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <p className="text-[11px] font-black text-slate-700">
                      Sewa {contract.lama_sewa} Bulan ({new Date(contract.mulai_sewa).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })})
                    </p>
                  </div>
                  <button 
                    onClick={() => handleExportPDF(contract)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-black text-[9px] uppercase tracking-wide px-3 py-2 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    PDF
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <div className="p-4 bg-white/40 rounded-2xl border border-dashed border-white text-center">
               <p className="text-[11px] text-slate-500 italic">Belum tersedia data arsip lama.</p>
             </div>
          )}
        </section>

      </div>

      {/* AREA TERSEMBUNYI KHUSUS UNTUK CONVERT HTML2PDF */}
      <div className="absolute top-0 -left-[9999px] w-[760px] bg-white text-black p-2 pointer-events-none">
        <ContractPDFTemplate contract={contractToPrint} profileData={profileData} />
      </div>

    </div>
  );
}