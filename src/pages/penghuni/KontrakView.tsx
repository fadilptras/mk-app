import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { useKontrak } from '../../hooks/useKontrak';

export default function KontrakView() {
  const navigate = useNavigate();
  // Tangkap refreshProfile dari hook
  const { profileData, loading: profileLoading, refreshProfile } = useProfileCheck();
  const { activeContract, contractHistory, jenisKontrakOtomatis, ajukanKontrak, loading: contractLoading } = useKontrak();

  // State Kontrol Navigasi View
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedHistoryContract, setSelectedHistoryContract] = useState<any>(null);
  
  // State Input Form
  const [lamaSewa, setLamaSewa] = useState<number>(0);
  const [mulaiSewa, setMulaiSewa] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Kalkulasi Tarif Dasar
  const hargaDasar = Number(profileData?.biaya_sewa) || 0;
  const baseDeposit = Number(profileData?.biaya_deposit) || 0;
  const deposit = jenisKontrakOtomatis === 'baru' ? baseDeposit : 0;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const getRemainingDays = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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

  const handleSimpan = async () => {
    if (lamaSewa === 0 || !mulaiSewa || !isAgreed) return;
    const date = new Date(mulaiSewa);
    date.setMonth(date.getMonth() + lamaSewa);
    const akhirSewa = date.toISOString().split('T')[0];

    const success = await ajukanKontrak(mulaiSewa, lamaSewa, akhirSewa, hargaDasar, deposit);
    if (success) {
      alert("Pengajuan Kontrak Berhasil Dikirim!");
      // Reset Form
      setLamaSewa(0);
      setMulaiSewa('');
      setIsAgreed(false);
      
      // Sinkronisasi paksa UI agar masuk ke mode Rekap/History
      setShowNewForm(false);
      if (refreshProfile) {
        await refreshProfile();
      }
    }
  };

  if (profileLoading || contractLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // =========================================================================
  // SELEKTOR UTAMA VIEW (SINKRONISASI AIRTIGHT KONTRAK VS FORM)
  // =========================================================================
  const contractToRender = selectedHistoryContract || (!showNewForm ? activeContract : null);

  if (contractToRender) {
    const isApproved = contractToRender.status === 'aktif';
    const isPending = contractToRender.status === 'menunggu_persetujuan';
    const sisaHari = getRemainingDays(contractToRender.akhir_sewa);

    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12 print:bg-white print:pb-0">
        <div className="max-w-3xl mx-auto">
          
          {/* Top Navbar Menu */}
          <div className="bg-white px-5 py-4 flex items-center justify-between shadow-sm border-b border-gray-100 print:hidden sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => selectedHistoryContract ? setSelectedHistoryContract(null) : (activeContract ? navigate('/dashboard') : setShowNewForm(false))} 
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                title="Kembali"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                {selectedHistoryContract ? 'Arsip Dokumen Riwayat' : 'Lembar Perjanjian Digital'}
              </h1>
            </div>
            <button 
              onClick={() => window.print()} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              EXPORT PDF
            </button>
          </div>

          {/* Banner Informasi Masa Berlaku Aktif Dinamis */}
          {isApproved && !selectedHistoryContract && (
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

          {/* Tampilan Fisik Surat Kontrak Perjanjian */}
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
                    <p className="text-xs font-black uppercase tracking-wide">
                      {getStatusLabel(contractToRender.status)}
                    </p>
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
                    {isApproved ? (
                      <>
                        <p className="font-black text-gray-900 underline uppercase">{contractToRender.approver?.full_name || 'ADMIN MUTIARA KOST'}</p>
                        <p className="text-[9px] text-emerald-600 font-mono mt-1">APPROVED SECURELY</p>
                      </>
                    ) : (
                      <p className="font-bold text-gray-400 italic bg-gray-50 border border-dashed border-gray-300 py-1 px-3 rounded inline-block">
                        {isPending ? 'Menunggu Tanda Tangan' : 'Tidak Berlaku'}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* =========================================================================
              PANEL DINAMIS: DISEMBUYIKAN APABILA STATUS MASIH 'MENUNGGU_PERSETUJUAN'
             ========================================================================= */}
          {!selectedHistoryContract && (
            <div className="m-5 space-y-6 print:hidden">
              {isPending && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-inner">
                  📌 <strong>Informasi Pengajuan:</strong> Pilihan perpanjangan kontrak baru dan akses tabel riwayat lama saat ini dikunci. Menu dinamis ini akan terbuka otomatis sesaat setelah Admin memverifikasi pengajuan kontrak aktif di atas.
                </div>
              )}

              {isApproved && (
                <>
                  {/* Tombol Buat Kontrak Perpanjangan Baru */}
                  <button 
                    onClick={() => setShowNewForm(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajukan Kontrak Baru / Perpanjangan
                  </button>

                  {/* Blok Riwayat Kontrak Lengkap */}
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
                                setTimeout(() => { window.print(); setSelectedHistoryContract(null); }, 150);
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
                </>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN INTERFACE FORM PENGAJUAN KONTRAK
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative bg-[#BFDDF0] min-h-screen shadow-inner">
        
        <div className="bg-indigo-600 px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => activeContract ? setShowNewForm(false) : navigate('/dashboard')} 
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
          {activeContract && (
            <button 
              onClick={() => setShowNewForm(false)}
              className="text-[10px] font-black bg-white text-indigo-600 px-3 py-1.5 rounded-full shadow"
            >
              BATAL
            </button>
          )}
        </div>

        <div className="p-5 space-y-5">

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
                  : 'Sisa uang jaminan/deposit dari masa kontrak lama resmi dihanguskan. Sesuai kesepakatan, sistem hanya membebankan tarif sewa kamar murni tanpa tambahan deposit baru.'}
              </p>
            </div>
          </div>

          {/* CARD IDENTITAS */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">Identitas Penghuni</h2>
              <button onClick={() => navigate('/profile/edit')} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">UBAH DATA</button>
            </div>
            <div className="space-y-2.5 text-xs font-medium text-gray-700">
              <div className="flex justify-between"><span className="text-gray-400">Nama Lengkap</span><span className="font-black text-gray-900">{profileData?.nama_lengkap || profileData?.full_name || '-'}</span></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between"><span className="text-gray-400">NIK / KTP</span><span>{profileData?.nik || '-'}</span></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between"><span className="text-gray-400">Kamar</span><span className="font-black text-indigo-600">Kamar {profileData?.room_number || '-'}</span></div>
            </div>
          </div>

          {/* CARD DETAIL TARIF */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-4">Rincian Komponen Kamar</h2>
            <div className="space-y-2.5 text-xs font-medium text-gray-700">
              <div className="flex justify-between"><span className="text-gray-400">Harga Sewa Bulanan</span><span className="font-black text-gray-900">{formatRupiah(hargaDasar)}</span></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between"><span className="text-gray-400">Biaya Deposit Tagihan</span><span className="font-black text-gray-900">{formatRupiah(deposit)}</span></div>
            </div>
          </div>

          {/* CARD KONFIGURASI INPUT */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-4">Konfigurasi Kontrak</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-0.5">Tanggal Mulai Sewa</label>
                <input type="date" value={mulaiSewa} onChange={(e) => setMulaiSewa(e.target.value)} className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-0.5">Durasi Sewa (Bulan)</label>
                <select value={lamaSewa} onChange={(e) => setLamaSewa(Number(e.target.value))} className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all">
                  <option value={0} disabled>Pilih Jangka Waktu</option>
                  <option value={1}>1 Bulan Sewa</option>
                  <option value={3}>3 Bulan Sewa</option>
                  <option value={6}>6 Bulan Sewa</option>
                  <option value={12}>1 Tahun Penuh (12 Bulan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ESTIMASI TOTAL */}
          {lamaSewa > 0 && (
            <div className="bg-indigo-600 rounded-[24px] p-5 text-white shadow-xl relative overflow-hidden">
              <h2 className="text-xs font-black text-indigo-100 uppercase tracking-wide mb-3">Estimasi Akumulasi Awal</h2>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-indigo-200">Total Komponen Biaya</span>
                <span className="text-base font-black">{formatRupiah((hargaDasar * lamaSewa) + deposit)}</span>
              </div>
            </div>
          )}

          {/* PERSETUJUAN & SUBMIT */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/40 space-y-4 shadow-sm">
            <div className={`flex items-start gap-3 p-2 rounded-xl border-2 transition-all cursor-pointer ${isAgreed ? 'bg-indigo-50/60 border-indigo-300' : 'border-transparent'}`} onClick={() => setIsAgreed(!isAgreed)}>
              <input type="checkbox" checked={isAgreed} readOnly className="mt-0.5 w-4 h-4 text-indigo-600" />
              <p className="text-[11px] text-gray-700 leading-snug font-black">Saya menyetujui seluruh ketentuan sewa menyewa di Mutiara Kost.</p>
            </div>
            <button disabled={lamaSewa === 0 || !mulaiSewa || !isAgreed} onClick={handleSimpan} className={`w-full text-white text-xs font-black py-4 rounded-xl transition-all uppercase tracking-widest ${lamaSewa > 0 && mulaiSewa && isAgreed ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>
              AJUKAN KONTRAK SEKARANG
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}