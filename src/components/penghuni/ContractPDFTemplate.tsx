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

  return (
    // Mengubah padding atas (pt-2) agar jarak kop surat dengan tepi kertas lebih sempit
    <div id="pdf-document-content" className="bg-white px-8 pb-8 pt-2 font-sans text-xs leading-relaxed text-gray-800">
      
      {/* KOP SURAT */}
      <div className="text-center border-b-4 border-double border-gray-900 pb-3 mb-4 mt-0">
        <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">MUTIARA KOST BOGOR</h1>
        <p className="text-xs font-bold text-gray-400 uppercase mt-0.5 tracking-wider">Surat Perjanjian Sewa Menyewa Kamar Kost</p>
        <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">REG-ID: {contract.id.split('-')[0].toUpperCase()}</p>
      </div>

      {/* ISI SURAT PERJANJIAN */}
      <div className="space-y-4">
        <p className="text-gray-600 font-medium font-serif italic text-justify">
          Bahwa dokumen elektronik ini mengikat secara hukum sebagai syarat sewa resmi kamar hunian Mutiara Kost Bogor yang disepakati bersama oleh pihak-pihak di bawah ini:
        </p>

        {/* PASAL I: IDENTITAS */}
        <section>
          <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-2 tracking-wide">I. DATA IDENTITAS PENGHUNI</h3>
          <div className="grid grid-cols-3 gap-y-1.5 px-3 font-medium text-gray-700">
            <div className="text-gray-400 font-bold">Nama Lengkap</div>
            <div className="col-span-2 font-black text-gray-900">: {profileData?.nama_lengkap || profileData?.full_name || '-'}</div>
            <div className="text-gray-400 font-bold">NIK / KTP</div>
            <div className="col-span-2">: {profileData?.nik || '-'}</div>
            <div className="text-gray-400 font-bold">Alamat Asal</div>
            <div className="col-span-2">: {profileData?.alamat_asal || '-'}</div>
            <div className="text-gray-400 font-bold">Alamat Email</div>
            <div className="col-span-2">: {profileData?.email || '-'}</div>
            <div className="text-gray-400 font-bold">Kamar Alokasi</div>
            <div className="col-span-2 font-black text-indigo-600">: Kamar {profileData?.room_number || profileData?.rooms?.room_number || profileData?.rooms?.[0]?.room_number || '-'}</div>
            <div className="text-gray-400 font-bold">Kategori Kontrak</div>
            <div className="col-span-2 font-bold uppercase text-gray-900">: Kontrak {contract.jenis_kontrak}</div>
          </div>
        </section>

        {/* PASAL II: DURASI */}
        <section>
          <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-2 tracking-wide">II. JANGKA WAKTU SEWA</h3>
          <div className="grid grid-cols-3 gap-y-1.5 px-3 font-medium text-gray-700">
            <div className="text-gray-400 font-bold">Total Durasi</div>
            <div className="col-span-2 font-black text-gray-900">: {contract.lama_sewa} Bulan</div>
            <div className="text-gray-400 font-bold">Tanggal Mulai</div>
            <div className="col-span-2">: {formatDate(contract.mulai_sewa)}</div>
            <div className="text-gray-400 font-bold">Tanggal Berakhir</div>
            <div className="col-span-2 font-bold text-gray-900">: {formatDate(contract.akhir_sewa)}</div>
          </div>
        </section>

        {/* PASAL III: KEUANGAN */}
        <section>
          <h3 className="font-black text-gray-900 uppercase bg-gray-50 border-l-4 border-indigo-600 px-3 py-1.5 mb-2 tracking-wide">III. STRUKTUR BIAYA BERSAMA</h3>
          <div className="px-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold">
                  <th className="py-1.5">Deskripsi Komponen Pembayaran</th>
                  <th className="py-1.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 font-medium text-gray-700">
                  <td className="py-2">Biaya Sewa Kamar Kontrak (Per Bulan)</td>
                  <td className="py-2 font-bold text-right text-gray-900">{formatRupiah(contract.harga_per_bulan)}</td>
                </tr>
                {contract.deposit > 0 && (
                  <tr className="border-b border-gray-100 font-medium text-gray-700">
                    <td className="py-2">Uang Jaminan/Titipan Kamar (Deposit Awal)</td>
                    <td className="py-2 font-bold text-right text-gray-900">{formatRupiah(contract.deposit)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* PASAL IV: LEGALISASI & TANDA TANGAN */}
        <section className="mt-4 pt-2">
          <p className="text-right text-gray-400 font-bold italic px-3 mb-5">
            Disetujui secara digital di Bogor, pada {formatDate(contract.created_at)}
          </p>

          <div className="grid grid-cols-2 gap-8 px-3 text-center">
            {/* TTD Pihak Pertama */}
            <div className="relative">
              <p className="text-gray-400 font-bold mb-14">Pihak Pertama (Penghuni)</p>
              <p className="font-black text-gray-900 underline uppercase relative z-10">{profileData?.nama_lengkap || profileData?.full_name}</p>
              <p className="text-[9px] text-emerald-600 font-mono mt-0.5 uppercase tracking-wider relative z-10">SIGNED ELECTRONICALLY</p>
            </div>
            
            {/* TTD Pihak Kedua */}
            <div className="relative">
              <p className="text-gray-400 font-bold mb-14">Pihak Kedua (Pengelola Mutiara Kost)</p>
              
              {contract.status === 'aktif' ? (
                <>
                  {/* EFEK VISUAL: CAP/STEMPEL APPROVE DIGITAL */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -rotate-[15deg] border-[3px] border-emerald-500/30 text-emerald-500/30 rounded-full w-[85px] h-[85px] flex items-center justify-center pointer-events-none z-0">
                    <div className="text-center">
                      <p className="font-black text-[11px] tracking-widest border-b-[2px] border-emerald-500/30 pb-0.5 mb-0.5">APPROVED</p>
                      <p className="text-[7px] font-bold tracking-widest">MK-APP</p>
                    </div>
                  </div>

                  <p className="font-black text-gray-900 underline uppercase relative z-10">{contract.approver?.full_name || 'ADMIN MUTIARA KOST'}</p>
                  <p className="text-[9px] text-emerald-600 font-mono mt-0.5 uppercase tracking-wider relative z-10">APPROVED SECURELY</p>
                </>
              ) : (
                <p className="font-bold text-gray-400 italic bg-gray-50 border border-dashed border-gray-300 py-1 px-3 rounded inline-block relative z-10">
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