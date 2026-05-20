import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { useKontrak } from '../../hooks/useKontrak';

export default function KontrakView() {
  const navigate = useNavigate();
  const { profileData, loading: profileLoading } = useProfileCheck();
  const { activeContract, jenisKontrakOtomatis, ajukanKontrak, loading: submitLoading } = useKontrak();

  // State Form
  const [lamaSewa, setLamaSewa] = useState<number>(0);
  const [mulaiSewa, setMulaiSewa] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // =========================================================================
  // KALKULASI DINAMIS DARI TABEL USERS
  // =========================================================================
  const hargaDasar = Number(profileData?.biaya_sewa) || 0;
  const baseDeposit = Number(profileData?.biaya_deposit) || 0;
  
  // Deposit hanya ditagihkan jika jenis kontraknya adalah "baru" (Sewa Awal)
  const deposit = jenisKontrakOtomatis === 'baru' ? baseDeposit : 0;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleSimpan = async () => {
    if (lamaSewa === 0 || !mulaiSewa || !isAgreed) return;
    const date = new Date(mulaiSewa);
    date.setMonth(date.getMonth() + lamaSewa);
    const akhirSewa = date.toISOString().split('T')[0];

    const success = await ajukanKontrak(mulaiSewa, lamaSewa, akhirSewa, hargaDasar, deposit);
    if (success) {
      alert("Pengajuan Kontrak Berhasil!");
      window.location.reload(); 
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN 1: LEMBAR DOKUMEN RESMI (REKAPAN & STATUS KONTRAK)
  // =========================================================================
  if (activeContract) {
    const isApproved = activeContract.status === 'aktif';
    const tanggalKontrakDibuat = new Date(activeContract.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-10 print:bg-white print:pb-0">
        <div className="max-w-3xl mx-auto">
          
          <div className="bg-white px-5 py-4 flex items-center justify-between shadow-sm print:hidden sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" 
                aria-label="Kembali ke halaman sebelumnya" 
                title="Kembali"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-sm font-black text-gray-800 uppercase tracking-wider">Rekapan Perjanjian</h1>
            </div>
            <button 
              onClick={handleExportPDF} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95" 
              aria-label="Cetak atau simpan dokumen ke PDF" 
              title="Ekspor PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              UNDUH PDF
            </button>
          </div>

          <div className="bg-white m-5 p-8 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-none print:m-0 print:p-0">
            <div className="text-center border-b-4 border-double border-gray-900 pb-5 mb-6">
              <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">MUTIARA KOST BOGOR</h1>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-wider">Surat Perjanjian Sewa Menyewa Hunian</p>
              <p className="text-[10px] text-gray-400 font-mono mt-2 uppercase">ID REG: {activeContract.id.split('-')[0]}</p>
            </div>

            <div className="space-y-6 text-xs leading-relaxed">
              <p className="text-gray-700 font-medium">
                Pada hari ini, Perjanjian Sewa Menyewa Kamar Kost ini dibuat secara sah secara elektronik oleh dan di antara pihak-pihak yang tertera di bawah ini:
              </p>

              <section>
                <h3 className="font-black text-gray-900 uppercase bg-gray-100 px-3 py-1.5 mb-2.5 tracking-wide">I. IDENTITAS PENYEWA (PIHAK PERTAMA)</h3>
                <div className="grid grid-cols-3 gap-y-2 px-3">
                  <div className="text-gray-500 font-bold">Nama Lengkap</div>
                  <div className="col-span-2 font-black text-gray-900">: {profileData?.nama_lengkap || profileData?.full_name || '-'}</div>
                  
                  <div className="text-gray-500 font-bold">NIK / KTP</div>
                  <div className="col-span-2 font-medium text-gray-800">: {profileData?.nik || '-'}</div>

                  <div className="text-gray-500 font-bold">Alamat Asal</div>
                  <div className="col-span-2 font-medium text-gray-800">: {profileData?.alamat_asal || '-'}</div>

                  <div className="text-gray-500 font-bold">Alamat Email</div>
                  <div className="col-span-2 font-medium text-gray-800">: {profileData?.email || '-'}</div>

                  <div className="text-gray-500 font-bold">Nomor Kamar</div>
                  <div className="col-span-2 font-black text-indigo-700">: Kamar {profileData?.room_number || '-'}</div>

                  <div className="text-gray-500 font-bold">Kategori Kontrak</div>
                  <div className="col-span-2 font-bold text-gray-800 uppercase">: Kontrak {activeContract.jenis_kontrak}</div>
                </div>
              </section>

              <section>
                <h3 className="font-black text-gray-900 uppercase bg-gray-100 px-3 py-1.5 mb-2.5 tracking-wide">II. JANGKA WAKTU & PERIODE SEWA</h3>
                <div className="grid grid-cols-3 gap-y-2 px-3">
                  <div className="text-gray-500 font-bold">Total Durasi</div>
                  <div className="col-span-2 font-black text-gray-900">: {activeContract.lama_sewa} Bulan</div>
                  
                  <div className="text-gray-500 font-bold">Tanggal Mulai</div>
                  <div className="col-span-2 font-bold text-gray-800">: {new Date(activeContract.mulai_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  
                  <div className="text-gray-500 font-bold">Tanggal Berakhir</div>
                  <div className="col-span-2 font-bold text-gray-800">: {new Date(activeContract.akhir_sewa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </section>

              <section>
                <h3 className="font-black text-gray-900 uppercase bg-gray-100 px-3 py-1.5 mb-2.5 tracking-wide">III. RINCIAN BIAYA PERJANJIAN</h3>
                <div className="px-3">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300 text-gray-600 font-bold">
                        <th className="py-2">Deskripsi Komponen Sewa</th>
                        <th className="py-2 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 text-gray-700 font-medium">
                        <td className="py-2.5">Biaya Sewa Kamar (Per Bulan)</td>
                        <td className="py-2.5 font-bold text-right text-gray-900">{formatRupiah(activeContract.harga_per_bulan)}</td>
                      </tr>
                      {activeContract.deposit > 0 && (
                        <tr className="border-b border-gray-100 text-gray-700 font-medium">
                          <td className="py-2.5">Uang Titipan Jaminan Kamar (Deposit Awal)</td>
                          <td className="py-2.5 font-bold text-right text-gray-900">{formatRupiah(activeContract.deposit)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mt-10 page-break-inside-avoid">
                <h3 className="font-black text-gray-900 uppercase bg-gray-100 px-3 py-1.5 mb-4 tracking-wide">IV. LEGALISASI & EKSEKUSI</h3>
                
                <div className={`mx-3 p-3 rounded-xl border-2 flex items-center justify-between mb-6 ${isApproved ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Status Validasi Dokumen</p>
                    <p className={`text-xs font-black uppercase ${isApproved ? 'text-emerald-700' : 'text-amber-600'}`}>
                      {isApproved ? '✓ Terverifikasi & Aktif Legally' : '⏰ Menunggu Verifikasi Pengelola'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center rounded p-1">
                    <svg className="w-full h-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm0 8h2v2H5v-2zm8-10h6v6h-6V3zm2 2v2h2V5h-2zm-10 8h6v6H3v-6zm2 2v2h2v-2H5zm13-5h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2-6h2v2h-2v-2zm4-4h2v2h-2V5zm-2 2h2v2h-2V7zm2 6h2v2h-2v-2z"/>
                    </svg>
                  </div>
                </div>

                <p className="text-right text-gray-600 font-bold italic px-3 mb-8">
                  Dibuat dan disetujui digital di Bogor, pada {tanggalKontrakDibuat}.
                </p>

                <div className="grid grid-cols-2 gap-8 px-3 text-center">
                  <div>
                    <p className="text-gray-500 font-bold mb-16">Pihak Pertama (Penghuni)</p>
                    <p className="font-black text-gray-900 underline uppercase">{profileData?.nama_lengkap || profileData?.full_name}</p>
                    <p className="text-[9px] text-emerald-600 font-mono mt-1">SIGNED DIGITAL via MK-APP</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold mb-16">Pihak Kedua (Pengelola Mutiara Kost)</p>
                    {isApproved ? (
                      <>
                        <p className="font-black text-gray-900 underline uppercase">{activeContract.approver?.full_name || 'ADMIN MUTIARA KOST'}</p>
                        <p className="text-[9px] text-emerald-600 font-mono mt-1">APPROVED SECURELY</p>
                      </>
                    ) : (
                      <p className="font-bold text-gray-400 italic bg-gray-50 border border-dashed border-gray-300 py-1 px-2 rounded inline-block">
                        Menunggu Tanda Tangan
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN 2: FORM PENGAJUAN KONTRAK BARU 
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative bg-[#BFDDF0] min-h-screen shadow-inner">
        
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white" 
            aria-label="Kembali ke Dashboard" 
            title="Kembali"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Pengajuan Kontrak Baru</h1>
        </div>

        <div className="p-5 space-y-5">

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-start shadow-sm mb-2">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs font-black text-indigo-900 mb-1 tracking-wide uppercase">Petunjuk Pengisian</h2>
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                Halaman ini berfungsi untuk membuat kesepakatan sewa kamar secara elektronik. Silakan periksa kembali kecocokan data Anda di bawah ini dan tentukan durasi masa sewa Anda.
              </p>
            </div>
          </div>

          {/* CARD 1: IDENTITAS PRIBADI */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">Identitas Penghuni</h2>
              </div>
              <button 
                onClick={() => navigate('/profile/edit')} 
                className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-indigo-100"
                aria-label="Ubah data profil Anda jika ada kesalahan"
                title="Ubah Data Profil"
              >
                UBAH DATA
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Nama Lengkap</span>
                <span className="font-black text-gray-800 text-right max-w-[180px]">{profileData?.nama_lengkap || profileData?.full_name || '-'}</span>
              </div>
              <div className="w-full h-px bg-gray-100"></div>
              
              <div className="flex justify-between items-start">
                <span className="text-gray-400 font-bold uppercase text-[10px] mt-0.5">NIK / KTP</span>
                <span className="font-bold text-gray-800 text-right">{profileData?.nik || 'Belum diisi'}</span>
              </div>
              <div className="w-full h-px bg-gray-100"></div>
              
              <div className="flex justify-between items-start">
                <span className="text-gray-400 font-bold uppercase text-[10px] mt-0.5 shrink-0">Alamat Asal</span>
                <span className="font-bold text-gray-800 text-right max-w-[200px]">{profileData?.alamat_asal || 'Belum diisi'}</span>
              </div>
              <div className="w-full h-px bg-gray-100"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Email</span>
                <span className="font-bold text-gray-600 truncate max-w-[180px]">{profileData?.email || 'Belum diisi'}</span>
              </div>
            </div>
          </div>

          {/* CARD 2: DATA KAMAR & BIAYA */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                </svg>
              </div>
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">Detail Kamar</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Nomor Kamar</span>
                <span className="font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  Kamar {profileData?.room_number || '-'}
                </span>
              </div>
              <div className="w-full h-px bg-gray-100"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Tarif Sewa (Per Bulan)</span>
                <span className="font-black text-gray-800">{formatRupiah(hargaDasar)}</span>
              </div>
              <div className="w-full h-px bg-gray-100"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Biaya Deposit (Awal)</span>
                <span className="font-black text-gray-800">{formatRupiah(deposit)}</span>
              </div>
            </div>
          </div>

          {/* CARD 3: KONFIGURASI KONTRAK */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">Konfigurasi Kontrak</h2>
              <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                {jenisKontrakOtomatis === 'baru' ? 'Sewa Awal' : 'Perpanjangan'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-0.5">Tanggal Masuk Sewa</label>
                <input 
                  type="date" aria-label="Tanggal Mulai Sewa" title="Mulai Sewa"
                  value={mulaiSewa}
                  onChange={(e) => setMulaiSewa(e.target.value)}
                  className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-0.5">Durasi Sewa (Bulan)</label>
                <select 
                  value={lamaSewa} aria-label="Lama Durasi Sewa" title="Lama Sewa"
                  onChange={(e) => setLamaSewa(Number(e.target.value))}
                  className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-12px)_center]"
                >
                  <option value={0} disabled>Pilih Jangka Waktu</option>
                  <option value={1}>1 Bulan Sewa</option>
                  <option value={3}>3 Bulan Sewa</option>
                  <option value={6}>6 Bulan Sewa</option>
                  <option value={12}>1 Tahun Penuh (12 Bulan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 4: RINCIAN BIAYA (Hanya Ditampilkan Saat Durasi Sudah Dipilih) */}
          {lamaSewa > 0 && (
            <div className="bg-indigo-600 rounded-[24px] p-5 shadow-xl shadow-indigo-300 text-white animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <h2 className="text-xs font-black text-indigo-100 uppercase tracking-wide mb-4 relative z-10">Rincian Biaya</h2>
              
              <div className="space-y-3 text-xs relative z-10">
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/20">
                  <span className="text-indigo-100 font-medium">Biaya Sewa (Per Bulan)</span>
                  <span className="font-bold text-sm">{formatRupiah(hargaDasar)}</span>
                </div>
                
                {deposit > 0 && (
                  <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/20">
                    <span className="text-indigo-100 font-medium">Uang Jaminan (Deposit)</span>
                    <span className="font-bold text-sm">{formatRupiah(deposit)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide mb-3">Ketentuan & Tata Tertib</h2>
            <div className="h-32 overflow-y-auto bg-gray-50 border border-gray-100 rounded-xl p-3 text-[10px] text-gray-500 leading-relaxed font-medium space-y-2">
              <p><strong className="text-gray-700">PASAL 1 (MASA SEWA):</strong> Jangka waktu sewa mengikat penuh sesuai durasi yang dipilih. Pembatalan sewa secara sepihak sebelum masa kontrak habis tidak berhak atas pengembalian dana.</p>
              <p><strong className="text-gray-700">PASAL 2 (KEWAJIBAN BAYAR):</strong> Pembayaran bulanan wajib diselesaikan paling lambat pada tanggal jatuh tempo. Keterlambatan dapat memicu pemutusan daya token/fasilitas listrik kamar.</p>
              <p><strong className="text-gray-700">PASAL 3 (TATA TERTIB KOST):</strong> Penghuni dilarang keras merusak properti, berbuat gaduh, membawa zat terlarang (narkoba/miras), atau membawa tamu lawan jenis menginap tanpa persetujuan tertulis pengelola.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/40 space-y-4 shadow-sm">
            <div 
              className={`flex items-start gap-3 p-2 rounded-xl border-2 transition-all cursor-pointer ${isAgreed ? 'bg-indigo-50/60 border-indigo-300' : 'bg-transparent border-transparent'}`}
              onClick={() => setIsAgreed(!isAgreed)}
            >
              <input 
                type="checkbox" aria-label="Saya menyetujui seluruh ketentuan sewa" title="Persetujuan Syarat"
                checked={isAgreed}
                readOnly
                className="mt-0.5 w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500" 
              />
              <p className="text-[11px] text-gray-700 leading-snug font-black">
                Saya telah membaca, memahami, dan menyetujui seluruh ketentuan di atas tanpa paksaan apa pun.
              </p>
            </div>

            <button 
              disabled={lamaSewa === 0 || !mulaiSewa || !isAgreed || submitLoading}
              onClick={handleSimpan}
              className={`w-full text-white text-xs font-black py-4 rounded-xl transition-all shadow-md uppercase tracking-widest
                ${(lamaSewa > 0 && mulaiSewa && isAgreed && !submitLoading) 
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200' 
                  : 'bg-gray-300 shadow-none cursor-not-allowed'
                }`}
              aria-label="Ajukan Kontrak"
              title="Ajukan Dokumen"
            >
              {submitLoading ? 'MENGIRIM DOKUMEN...' : 'AJUKAN KONTRAK SEKARANG'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}