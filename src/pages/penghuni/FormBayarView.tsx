// src/pages/penghuni/FormBayarView.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { supabase } from '../../lib/supabase';

export default function FormBayarView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileData, loading: profileLoading } = useProfileCheck();
  
  // Ambil data tagihan yang dioper dari halaman SewaView
  const tagihan = location.state?.tagihan;

  const [uploading, setUploading] = useState(false);
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    if (!tagihan) {
      alert("Data tagihan tidak ditemukan!");
      navigate('/sewa');
    }
  }, [tagihan, navigate]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBuktiFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitPembayaran = async () => {
    if (!tagihan || !buktiFile) {
      alert("Silakan pilih berkas bukti transfer terlebih dahulu!");
      return;
    }

    setUploading(true);
    try {
      // 1. Proses upload file ke Supabase Storage (Bucket: 'bukti-transfer')
      const fileExt = buktiFile.name.split('.').pop();
      const fileName = `${profileData?.id}-${Date.now()}.${fileExt}`;
      const filePath = `pembayaran/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bukti-transfer')
        .upload(filePath, buktiFile);

      if (uploadError) throw uploadError;

      // Ambil Public URL hasil upload
      const { data: { publicUrl } } = supabase.storage
        .from('bukti-transfer')
        .getPublicUrl(filePath);

      // 2. Update baris data tagihan_sewa di database
      const { error: updateError } = await supabase
        .from('tagihan_sewa')
        .update({
          status: 'pending',
          bukti_transfer: publicUrl,
          keterangan: keterangan,
          tanggal_upload: new Date().toISOString()
        })
        .eq('id', tagihan.id);

      if (updateError) throw updateError;

      alert("Bukti pembayaran berhasil dikirim! Mohon tunggu verifikasi pengelola.");
      navigate('/sewa');
    } catch (err: any) {
      alert(`Gagal mengirim pembayaran: ${err.message}`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto bg-[#BFDDF0] min-h-screen shadow-inner">
        
        {/* Header Navigation */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Kirim Pembayaran</h1>
        </div>

        <div className="p-5 space-y-5">
          
          {/* REKENING TUJUAN TRANSFER */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[24px] p-5 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 translate-x-4 translate-y-4">
              <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
            </div>
            <div>
              {/* Keterangan Di Atas Nama Pemilik Rekening */}
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Nama Pemilik Rekening Utama</p>
              {/* Mengganti judul dummy dengan nama pemilik dari database */}
              <h3 className="text-lg font-black tracking-wide mt-1 uppercase text-yellow-300">
                {profileData?.nama_rek_pembayaran || (
                  <span className="text-red-400 italic text-sm font-medium">Belum diatur Admin</span>
                )}
              </h3>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Nomor Rekening</span>
                <span className="font-mono font-black text-sm text-white tracking-wider">
                  {profileData?.no_rek_pembayaran || (
                    <span className="text-red-400 italic text-[11px]">Belum diatur Admin</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Mengubah label 'Nama Pemilik' menjadi 'Bank Tujuan' */}
                <span className="text-gray-400 font-medium">Bank Tujuan</span>
                <span className="font-bold uppercase tracking-wide text-white">
                  {profileData?.no_rek_pembayaran ? 'Bank Transfer' : (
                    <span className="text-red-400 italic text-[11px]">Belum diatur Admin</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* RINCIAN IDENTITAS & TAGIHAN */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-white/60 space-y-3.5">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-1">Rincian Informasi Kamar & Sewa</h2>
            <div className="space-y-2.5 text-xs font-medium text-gray-700">
              <div className="flex justify-between"><span className="text-gray-400">Nama Lengkap</span><span className="font-black text-gray-900">{profileData?.nama_lengkap || profileData?.full_name}</span></div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex justify-between"><span className="text-gray-400">Nomor Kamar</span><span className="font-black text-indigo-600">Kamar {profileData?.room_number || '-'}</span></div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex justify-between"><span className="text-gray-400">Periode Tagihan</span><span className="font-bold text-gray-900">{tagihan?.periode_tagihan}</span></div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex justify-between items-center"><span className="text-gray-400">Total Nominal</span><span className="text-base font-black text-gray-900">{formatRupiah(tagihan?.nominal_tagihan || 0)}</span></div>
            </div>
          </div>

          {/* BUKTI TRANSFER & UPLOAD INPUT */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-white/60 space-y-4">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">Unggah Berkas Bukti Transfer</h2>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-0.5">Catatan Tambahan (Opsional)</label>
              <textarea 
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Pembayaran lunas sewa bulan Mei + titipan laundry"
                className="w-full border-2 border-gray-100 bg-gray-50 text-gray-800 text-xs rounded-xl p-3 font-medium outline-none focus:border-indigo-600 focus:bg-white transition-all h-20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-0.5">File Bukti Foto/Struk</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 text-center hover:bg-gray-100/50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} alt="Preview Bukti" className="max-h-40 mx-auto rounded-lg shadow-inner border" />
                    <p className="text-[10px] text-indigo-600 font-bold">Klik atau seret file kembali untuk mengganti gambar</p>
                  </div>
                ) : (
                  <div className="py-4 space-y-1 text-gray-400">
                    <svg className="w-8 h-8 mx-auto stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-bold text-gray-600">Pilih Berkas Struk Pembayaran</p>
                    <p className="text-[10px]">Mendukung ekstensi gambar PNG, JPG, JPEG</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TRIGGER SUBMIT ACTION */}
          <button 
            disabled={!buktiFile || uploading}
            onClick={handleSubmitPembayaran}
            className={`w-full text-white text-xs font-black py-4 rounded-xl transition-all uppercase tracking-widest ${buktiFile && !uploading ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {uploading ? 'SEDANG MENGIRIM...' : 'KIRIM BUKTI PEMBAYARAN'}
          </button>

        </div>
      </div>
    </div>
  );
}