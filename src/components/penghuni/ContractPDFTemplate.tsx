import { generateRefID } from '../../utils/formatId';

interface ContractPDFTemplateProps {
  contract: any;
  profileData: any;
}

export default function ContractPDFTemplate({ contract, profileData }: ContractPDFTemplateProps) {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (!contract) return null;

  // Status riwayat arsip ('selesai', 'berakhir') tetap diakui sebagai kontrak yang sah di masa lalu
  const isValidSignature = ['aktif', 'selesai', 'berakhir'].includes(contract.status);
  
  // Mengutamakan tanggal persetujuan admin, fallback ke tanggal pembuatan jika belum disetujui
  const approvalDate = contract.approved_at ? formatDate(contract.approved_at) : formatDate(contract.created_at);

  return (
    <div id="pdf-document-content" className="bg-white px-8 pb-8 pt-4 font-sans text-xs leading-relaxed text-gray-800">
      
      {/* KOP SURAT */}
      <div className="text-center border-b-4 border-double border-gray-900 pb-4 mb-5">
        <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">MUTIARA KOST BOGOR</h1>
        <p className="text-xs font-bold text-gray-600 uppercase mt-1 tracking-wider">Surat Perjanjian Sewa Menyewa Kamar Kost</p>
        <p className="text-[10px] text-gray-500 font-mono mt-1.5 uppercase font-bold tracking-widest">
          NO. REF: {generateRefID('kontrak', contract.id, contract.created_at)}
        </p>
      </div>

      {/* ISI SURAT PERJANJIAN */}
      <div className="space-y-5">
        <p className="text-gray-900 font-semibold text-justify leading-relaxed px-1">
          Dengan ini menerangkan bahwa dokumen elektronik ini sah dan mengikat secara hukum sebagai Surat Perjanjian Sewa Menyewa Kamar Hunian di Mutiara Kost Bogor. Perjanjian ini disepakati dengan itikad baik oleh pihak-pihak di bawah ini:
        </p>

        {/* PASAL I: IDENTITAS */}
        <section>
          <h3 className="font-black text-gray-900 uppercase bg-gray-100 border-l-4 border-gray-800 px-3 py-1.5 mb-3 tracking-wide">I. DATA IDENTITAS PENGHUNI</h3>
          <div className="grid grid-cols-3 gap-y-2 px-3 font-medium text-gray-800">
            <div className="text-gray-600 font-bold">Nama Lengkap</div>
            <div className="col-span-2 font-black text-gray-900">: {profileData?.nama_lengkap || profileData?.full_name || '-'}</div>
            <div className="text-gray-600 font-bold">NIK / KTP</div>
            <div className="col-span-2">: {profileData?.nik || '-'}</div>
            <div className="text-gray-600 font-bold">Alamat Asal</div>
            <div className="col-span-2">: {profileData?.alamat_asal || '-'}</div>
            <div className="text-gray-600 font-bold">Alamat Email</div>
            <div className="col-span-2">: {profileData?.email || '-'}</div>
            <div className="text-gray-600 font-bold">Kamar Alokasi</div>
            <div className="col-span-2 font-black">: Kamar {profileData?.room_number || profileData?.rooms?.room_number || profileData?.rooms?.[0]?.room_number || '-'}</div>
            <div className="text-gray-600 font-bold">Kategori Kontrak</div>
            <div className="col-span-2 font-bold uppercase">: Kontrak {contract.jenis_kontrak}</div>
          </div>
        </section>

        {/* PASAL II: DURASI */}
        <section>
          <h3 className="font-black text-gray-900 uppercase bg-gray-100 border-l-4 border-gray-800 px-3 py-1.5 mb-3 tracking-wide">II. JANGKA WAKTU SEWA</h3>
          <div className="grid grid-cols-3 gap-y-2 px-3 font-medium text-gray-800">
            <div className="text-gray-600 font-bold">Total Durasi</div>
            <div className="col-span-2 font-black text-gray-900">: {contract.lama_sewa} Bulan</div>
            <div className="text-gray-600 font-bold">Tanggal Mulai</div>
            <div className="col-span-2">: {formatDate(contract.mulai_sewa)}</div>
            <div className="text-gray-600 font-bold">Tanggal Berakhir</div>
            <div className="col-span-2 font-bold text-gray-900">: {formatDate(contract.akhir_sewa)}</div>
          </div>
        </section>

        {/* PASAL III: KEUANGAN */}
        <section>
          <h3 className="font-black text-gray-900 uppercase bg-gray-100 border-l-4 border-gray-800 px-3 py-1.5 mb-3 tracking-wide">III. STRUKTUR BIAYA BERSAMA</h3>
          <div className="px-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-gray-800 font-black">
                  <th className="py-2">Deskripsi Komponen Pembayaran</th>
                  <th className="py-2 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 font-semibold text-gray-800">
                  <td className="py-2.5">Biaya Sewa Kamar Kontrak (Per Bulan)</td>
                  <td className="py-2.5 font-black text-right text-gray-900">{formatRupiah(contract.harga_per_bulan)}</td>
                </tr>
                {contract.deposit > 0 && (
                  <tr className="border-b border-gray-200 font-semibold text-gray-800">
                    <td className="py-2.5">Uang Jaminan/Titipan Kamar (Deposit Awal)</td>
                    <td className="py-2.5 font-black text-right text-gray-900">{formatRupiah(contract.deposit)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* PASAL IV: LEGALISASI & TANDA TANGAN */}
        <section className="mt-8 pt-4">
          <p className="text-gray-900 font-semibold text-justify leading-relaxed px-1 mb-6">
            Demikian Surat Perjanjian Sewa Menyewa ini dibuat dan disepakati secara sistem elektronik tanpa adanya paksaan dari pihak manapun, serta memiliki kekuatan hukum pembuktian yang sah.
          </p>

          <p className="text-right text-gray-900 font-bold px-3 mb-8">
            Ditetapkan di Bogor, pada tanggal {approvalDate}
          </p>

          <div className="grid grid-cols-2 gap-8 px-3 text-center mt-4">
            {/* TTD Pihak Pertama */}
            <div className="relative">
              <p className="text-gray-800 font-bold mb-16">Pihak Pertama (Penghuni)</p>
              <p className="font-black text-gray-900 underline uppercase relative z-10">{profileData?.nama_lengkap || profileData?.full_name}</p>
              <p className="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-wider relative z-10">Tanda Tangan Digital</p>
            </div>
            
            {/* TTD Pihak Kedua */}
            <div className="relative">
              <p className="text-gray-800 font-bold mb-16">Pihak Kedua (Mutiara Kost)</p>
              
              {isValidSignature ? (
                <>
                  {/* EFEK VISUAL: CAP/STEMPEL APPROVE DIGITAL */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -rotate-[15deg] border-[3px] border-emerald-600/40 text-emerald-600/40 rounded-full w-[90px] h-[90px] flex items-center justify-center pointer-events-none z-0">
                    <div className="text-center">
                      <p className="font-black text-[12px] tracking-widest border-b-[2px] border-emerald-600/40 pb-0.5 mb-0.5">TERVERIFIKASI</p>
                      <p className="text-[8px] font-bold tracking-widest">SISTEM MK</p>
                    </div>
                  </div>

                  <p className="font-black text-gray-900 underline uppercase relative z-10">{contract.approver?.full_name || 'ADMIN MUTIARA KOST'}</p>
                  <p className="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-wider relative z-10">Disetujui Elektronik</p>
                </>
              ) : (
                <p className="font-bold text-gray-500 bg-gray-100 border border-dashed border-gray-400 py-1.5 px-4 rounded inline-block relative z-10">
                  {contract.status === 'menunggu_persetujuan' ? 'Menunggu Approval' : 'Tidak Valid'}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}