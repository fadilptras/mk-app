import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { useKontrak } from '../../hooks/useKontrak';

export default function KontrakDashboardView() {
  const navigate = useNavigate();
  const { profileData, loading: profileLoading } = useProfileCheck();
  const { activeContract, contractHistory, getRemainingDays, loading: contractLoading } = useKontrak();
  const [selectedHistoryContract, setSelectedHistoryContract] = useState<any>(null);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'aktif': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'menunggu_persetujuan': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'ditolak': return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'selesai': return 'bg-gray-100 border-gray-300 text-gray-600';
      case 'dibatalkan': return 'bg-purple-50 border-purple-200 text-purple-600';
      default: return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aktif': return '✓ Terverifikasi & Aktif Secara Hukum';
      case 'menunggu_persetujuan': return '⏰ Menunggu Verifikasi Pengelola';
      case 'ditolak': return '❌ Pengajuan Kontrak Ditolak';
      case 'selesai': return '📁 Masa Kontrak Selesai / Arsip';
      case 'dibatalkan': return '🚫 Kontrak Dibatalkan Sepihak';
      default: return status;
    }
  };

  if (profileLoading || contractLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Pilih kontrak mana yang dirender pada mode preview berkas kertas surat
  const contractToRender = selectedHistoryContract || activeContract;
  const sisaHari = activeContract ? getRemainingDays(activeContract.akhir_sewa) : 0;

  // Aturan Validasi Akses Form Perpanjangan:
  // 1. Jika belum punya kontrak aktif/pending sama sekali (User baru), boleh isi form.
  // 2. Jika ada kontrak aktif berkategori 'aktif', tombol terbuka hanya jika sisa hari <= 14 hari.
  // 3. Jika statusnya masih 'menunggu_persetujuan', tombol dikunci total demi menghindari double-booking.
  const isUserBaru = !activeContract;
  const isSisaHariValid = activeContract?.status === 'aktif' && sisaHari <= 14;
  const canRenew = isUserBaru || isSisaHariValid;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12 print:bg-white print:pb-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Navbar */}
        <div className="bg-white px-5 py-4 flex items-center justify-between shadow-sm border-b border-gray-100 print:hidden sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => selectedHistoryContract ? setSelectedHistoryContract(null) : navigate('/dashboard')} 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="Kembali"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              {selectedHistoryContract ? 'Arsip Berkas Riwayat' : 'Manajemen Kontrak Sewa'}
            </h1>
          </div>
          {contractToRender && (
            <button 
              onClick={() => window.print()} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              EXPORT PDF
            </button>
          )}
        </div>

        {/* State 1: Preview Berkas Surat Kontrak (Aktif/Riwayat Terpilih) */}
        {contractToRender ? (
          <>
            {/* Banner Countdown Sisa Hari */}
            {contractToRender.status === 'aktif' && !selectedHistoryContract && (
              <div className="m-5 p-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-md text-white flex items-center justify-between print:hidden">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Masa Aktif Hunian Anda</p>
                  <h4 className="text-sm font-black">
                    Selesai pada {new Date(contractToRender.akhir_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </h4>
                </div>
                <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 text-center shrink-0">
                  <p className="text-[18px] font-black leading-none">{sisaHari}</p>
                  <p className="text-[9px] font-bold uppercase text-indigo-100 tracking-wide mt-0.5">Hari Sisa</p>
                </div>
              </div>
            )}

            {/* Lembar Surat Perjanjian Fisik */}
            <div className="bg-white m-5 p-8 rounded-2xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:m-0 print:p-0">
              <div className="text-center border-b-4 border-double border-gray-900 pb-5 mb-6">
                <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">MUTIARA KOST BOGOR</h1>
                <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-wider">Surat Perjanjian Sewa Menyewa Kamar Kost</p>
                <p className="text-[10px] text-gray-400 font-mono mt-2 uppercase">REG-ID: {contractToRender.id.split('-')[0]}</p>
              </div>

              <div className="space-y-6 text-xs leading-relaxed">
                <p className="text-gray-600 font-medium font-serif italic">
                  Bahwa dokumen elektronik ini mengikat secara hukum sebagai syarat sewa resmi kamar hunian Mutiara Kost Bogor yang disepakati bersama oleh:
                </p>

                <section>
                  <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-2.5 tracking-wide">I. DATA IDENTITAS PENGHUNI</h3>
                  <div className="grid grid-cols-3 gap-y-2 px-3 font-medium text-gray-700">
                    <div className="text-gray-400 font-bold">Nama Lengkap</div>
                    <div className="col-span-2 font-black text-gray-900">: {profileData?.nama_lengkap || profileData?.full_name || '-'}</div>
                    <div className="text-gray-400 font-bold">NIK / KTP</div>
                    <div className="col-span-2">: {profileData?.nik || '-'}</div>
                    <div className="text-gray-400 font-bold">Alamat Asal</div>
                    <div className="col-span-2">: {profileData?.alamat_asal || '-'}</div>
                    <div className="text-gray-400 font-bold">Alamat Email</div>
                    <div className="col-span-2">: {profileData?.email || '-'}</div>
                    <div className="text-gray-400 font-bold">Kamar Dialokasikan</div>
                    <div className="col-span-2 font-black text-indigo-600">: Kamar {profileData?.room_number || '-'}</div>
                    <div className="text-gray-400 font-bold">Kategori Kontrak</div>
                    <div className="col-span-2 font-bold uppercase text-gray-900">: Kontrak {contractToRender.jenis_kontrak}</div>
                  </div>
                </section>

                <section>
                  <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-2.5 tracking-wide">II. JANGKA WAKTU SEWA</h3>
                  <div className="grid grid-cols-3 gap-y-2 px-3 font-medium text-gray-700">
                    <div className="text-gray-400 font-bold">Total Durasi</div>
                    <div className="col-span-2 font-black text-gray-900">: {contractToRender.lama_sewa} Bulan</div>
                    <div className="text-gray-400 font-bold">Tanggal Mulai</div>
                    <div className="col-span-2">: {new Date(contractToRender.mulai_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="text-gray-400 font-bold">Tanggal Berakhir</div>
                    <div className="col-span-2 font-bold text-gray-900">: {new Date(contractToRender.akhir_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </section>

                <section>
                  <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-2.5 tracking-wide">III. STRUKTUR BIAYA</h3>
                  <div className="px-3">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-bold">
                          <th className="py-2">Deskripsi Komponen Pembayaran</th>
                          <th className="py-2 text-right">Nominal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 font-medium text-gray-700">
                          <td className="py-2.5">Biaya Sewa Kamar Kontrak (Per Bulan)</td>
                          <td className="py-2.5 font-bold text-right text-gray-900">{formatRupiah(contractToRender.harga_per_bulan)}</td>
                        </tr>
                        {contractToRender.deposit > 0 && (
                          <tr className="border-b border-gray-100 font-medium text-gray-700">
                            <td className="py-2.5">Uang Jaminan/Titipan Kamar (Deposit Awal)</td>
                            <td className="py-2.5 font-bold text-right text-gray-900">{formatRupiah(contractToRender.deposit)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="mt-8 page-break-inside-avoid">
                  <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-4 tracking-wide">IV. LEGALISASI & EKSEKUSI</h3>
                  
                  <div className={`mx-3 p-3 rounded-xl border flex items-center justify-between mb-6 ${getStatusBadgeClass(contractToRender.status)}`}>
                    <div>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-wider mb-0.5">Status Validasi Dokumen</p>
                      <p className="text-xs font-black uppercase tracking-wide">{getStatusLabel(contractToRender.status)}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/40 border border-current flex items-center justify-center rounded p-1 opacity-75">
                      <svg className="w-full h-full text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm0 8h2v2H5v-2zm8-10h6v6h-6V3zm2 2v2h2V5h-2zm-10 8h6v6H3v-6zm2 2v2h2v-2H5zm13-5h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2-6h2v2h-2v-2zm4-4h2v2h-2V5zm-2 2h2v2h-2V7zm2 6h2v2h-2v-2z"/>
                      </svg>
                    </div>
                  </div>

                  <p className="text-right text-gray-400 font-bold italic px-3 mb-8">
                    Disetujui secara digital di Bogor, pada {new Date(contractToRender.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  <div className="grid grid-cols-2 gap-8 px-3 text-center">
                    <div>
                      <p className="text-gray-400 font-bold mb-16">Pihak Pertama (Penghuni)</p>
                      <p className="font-black text-gray-900 underline uppercase">{profileData?.nama_lengkap || profileData?.full_name}</p>
                      <p className="text-[9px] text-emerald-600 font-mono mt-1">SIGNED ELECTRONICALLY via MK-APP</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold mb-16">Pihak Kedua (Pengelola Mutiara Kost)</p>
                      {contractToRender.status === 'aktif' ? (
                        <>
                          <p className="font-black text-gray-900 underline uppercase">{contractToRender.approver?.full_name || 'ADMIN MUTIARA KOST'}</p>
                          <p className="text-[9px] text-emerald-600 font-mono mt-1">APPROVED SECURELY</p>
                        </>
                      ) : (
                        <p className="font-bold text-gray-400 italic bg-gray-50 border border-dashed border-gray-300 py-1 px-3 rounded inline-block">
                          {contractToRender.status === 'menunggu_persetujuan' ? 'Menunggu Tanda Tangan' : 'Tidak Berlaku'}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : (
          /* State Khusus Penghuni Baru yang belum punya rekap kontrak sewa apa-apa */
          <div className="m-5 p-8 bg-white border border-dashed border-gray-300 rounded-2xl text-center print:hidden">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="text-sm font-black text-gray-800 uppercase mb-1">Belum Ada Kontrak Aktif</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mb-4">Kamu terdeteksi sebagai penghuni baru atau tidak memiliki rekap ikatan kontrak digital resmi yang divalidasi oleh sistem.</p>
          </div>
        )}

        {/* Panel Kontrol Menu & Navigasi Bawah */}
        {!selectedHistoryContract && (
          <div className="m-5 space-y-6 print:hidden">
            
            {/* Validasi & Proteksi Tombol Form Perpanjangan */}
            {activeContract?.status === 'menunggu_persetujuan' && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-inner">
                📌 <strong>Informasi Pengajuan:</strong> Kamu memiliki satu pengajuan kontrak yang sedang berada dalam antrean peninjauan Admin. Menu perpanjangan baru dikunci hingga pengajuan di atas diverifikasi.
              </div>
            )}

            {activeContract?.status === 'aktif' && !canRenew && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl text-xs font-medium leading-relaxed">
                🔒 <strong>Akses Perpanjangan Terkunci:</strong> Masa sewa aktif kamu masih panjang. Fitur perpanjangan otomatis akan terbuka secara dinamis mulai <strong>H-14 sebelum tanggal berakhir sewa</strong> ({new Date(new Date(activeContract.akhir_sewa).getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}).
              </div>
            )}

            {/* Tombol ke Form Perpanjangan */}
            <button 
              disabled={!canRenew}
              onClick={() => navigate('/kontrak/perpanjang')}
              className={`w-full font-black py-4 px-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-xs tracking-widest uppercase ${
                canRenew 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100' 
                  : 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {isUserBaru ? 'Ajukan Kontrak Sewa Pertama' : 'Ajukan Kontrak Baru / Perpanjangan'}
            </button>

            {/* Blok Riwayat Tabel Arsip Kontrak */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-3.5 bg-indigo-600 rounded-sm"></div>
                Riwayat Arsip Kontrak
              </h3>
              
              {contractHistory && contractHistory.length > 0 ? (
                <div className="space-y-3">
                  {contractHistory.map((contract: any) => (
                    <div key={contract.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-gray-900 text-xs uppercase">REG-{contract.id.split('-')[0]}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${getStatusBadgeClass(contract.status)}`}>
                            {contract.status}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                            {contract.jenis_kontrak}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-500">
                          Periode: {new Date(contract.mulai_sewa).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - {new Date(contract.akhir_sewa).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} ({contract.lama_sewa} Bln)
                        </p>
                        <div className="text-[11px] font-medium text-gray-400 flex gap-3">
                          <span>Tarif: <strong className="text-gray-600">{formatRupiah(contract.harga_per_bulan)}</strong></span>
                          {contract.deposit > 0 && <span>Deposit: <strong className="text-gray-700">{formatRupiah(contract.deposit)}</strong></span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedHistoryContract(contract);
                          // Berikan delay kecil agar DOM render tersinkronasi rapi sebelum window.print dialog mencuat
                          setTimeout(() => { window.print(); setSelectedHistoryContract(null); }, 180);
                        }}
                        className="bg-white hover:bg-indigo-50 border border-gray-200 text-indigo-600 font-extrabold text-[10px] tracking-wide px-3 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-center"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        CETAK ARSIP
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic text-center py-5 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Belum tersedia data rekapitulasi arsip kontrak lama.
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}