interface InvoiceTemplateProps {
  detailTagihan: any;
}

export default function InvoiceTemplate({ detailTagihan }: InvoiceTemplateProps) {
  if (!detailTagihan) return null;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatFullDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) + ' WIB';
  };

  return (
    <div id="invoice-capture-area" className="bg-white w-[420px] p-8 text-slate-800 font-sans relative overflow-hidden box-border">
      
      {/* Aksen Lubang Tiket Kiri Kanan */}
      <div className="absolute left-0 top-[150px] -translate-x-1/2 w-8 h-8 bg-gray-100 rounded-full z-10"></div>
      <div className="absolute right-0 top-[150px] translate-x-1/2 w-8 h-8 bg-gray-100 rounded-full z-10"></div>

      {/* HEADER RESI */}
      <div className="text-center space-y-2 pb-5 border-b-2 border-dashed border-gray-200">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375M9 18h3.375m1.5 3H5.625c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125v13.5M9 21h6M9 3h6m2.25 14.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        </div>
        <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">Mutiara Kost Receipt</h2>
        <p className="text-xs font-bold text-slate-400 font-mono">NO. NOTA: #MK-{detailTagihan.id.split('-')[0].toUpperCase()}</p>
      </div>

      {/* NOMINAL TOTAL */}
      <div className="text-center py-6 space-y-2">
        <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Total Nominal</span>
        <h3 className="text-4xl font-black text-slate-900 tracking-tight">{formatRupiah(detailTagihan.nominal_tagihan)}</h3>
        <div className="pt-2">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-md border tracking-wider uppercase ${
            detailTagihan.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
            detailTagihan.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
            'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            {detailTagihan.status === 'paid' ? '✓ Lunas Terverifikasi' :
             detailTagihan.status === 'pending' ? '⏰ Antrean Verifikasi' : '✕ Belum Dibayar'}
          </span>
        </div>
      </div>

      {/* METADATA TRANSAKSI */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-3">
          <span className="text-slate-400 font-bold">Kategori Alokasi</span>
          <span className="text-slate-800 font-black uppercase text-xs">Sewa Kamar Kost</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-3">
          <span className="text-slate-400 font-bold">Periode Tagihan</span>
          <span className="text-indigo-600 font-black">{detailTagihan.periode_tagihan}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-3">
          <span className="text-slate-400 font-bold">Urutan Kontrak</span>
          <span className="text-slate-800 font-black">Bulan Ke-{detailTagihan.urutan_bulan}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-3">
          <span className="text-slate-400 font-bold">Jatuh Tempo</span>
          <span className="text-slate-600 font-black font-mono">{new Date(detailTagihan.jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* LOG WAKTU AUDIT */}
      <div className="mt-6 space-y-4">
        <div className="text-sm font-black text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          Jejak Alur Administrasi
        </div>
        <div className="space-y-3.5 pl-2 border-l-[3px] border-indigo-100 ml-2 relative">
          <div className="relative">
            <div className="absolute -left-[10.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-4">Waktu Pengunggahan</p>
            <p className="text-xs font-black text-slate-800 mt-0.5 ml-4">{formatFullDate(detailTagihan.tanggal_upload)}</p>
          </div>
          <div className="relative">
            <div className={`absolute -left-[10.5px] top-1.5 w-2.5 h-2.5 rounded-full ${detailTagihan.verified_at ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-4">Validasi Pengelola</p>
            <p className={`text-xs font-black mt-0.5 ml-4 ${detailTagihan.verified_at ? 'text-slate-800' : 'text-amber-500'}`}>
              {detailTagihan.verified_at ? formatFullDate(detailTagihan.verified_at) : 'Menunggu Approval Admin'}
            </p>
          </div>
        </div>
      </div>

      {/* BARCODE BAWAH */}
      <div className="pt-8 pb-2 text-center opacity-30 select-none">
        <div className="inline-block font-mono text-3xl tracking-[8px] text-slate-900 font-light select-none">
          ||||| | |||| || | ||| |||| |
        </div>
      </div>
      
    </div>
  );
}