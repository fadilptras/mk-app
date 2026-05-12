import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ProfileEditView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State sesuai persis dengan kolom di tabel user_profiles
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nik: '',
    no_whatsapp: '',
    jenis_kelamin: 'L',
    pekerjaan_instansi: '',
    darurat_nama: '',
    darurat_hp: '',
    darurat_hubungan: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoKtpFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesi tidak ditemukan. Silakan login kembali.');

      let fotoKtpUrl = null;

      // 1. Upload Foto KTP ke Storage (Opsional berdasarkan skema, tapi kita buat wajib di form ini agar aman)
      if (fotoKtpFile) {
        const fileExt = fotoKtpFile.name.split('.').pop();
        const filePath = `identitas_ktp/${user.id}-${Date.now()}.${fileExt}`; // Penamaan file aman
        
        const { error: uploadError } = await supabase.storage
          .from('berkas_penghuni')
          .upload(filePath, fotoKtpFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('berkas_penghuni').getPublicUrl(filePath);
        fotoKtpUrl = data.publicUrl;
      }

      // 2. Insert ke tabel user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: user.id,
          nama_lengkap: formData.nama_lengkap,
          nik: formData.nik,
          no_whatsapp: formData.no_whatsapp,
          jenis_kelamin: formData.jenis_kelamin,
          pekerjaan_instansi: formData.pekerjaan_instansi,
          darurat_nama: formData.darurat_nama,
          darurat_hp: formData.darurat_hp,
          darurat_hubungan: formData.darurat_hubungan,
          foto_ktp: fotoKtpUrl
        }]);

      if (profileError) throw profileError;

      // 3. Update status di tabel users
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_profile_complete: true })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. Jika sukses semua, kembali ke dashboard
      alert("Terima kasih! Profil berhasil diaktifkan.");
      navigate('/dashboard', { replace: true }); // replace agar tidak bisa di-back ke form ini lagi

    } catch (err: any) {
      console.error(err);
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative pb-24">
        
        <div className="bg-white px-6 py-5 border-b border-gray-100 sticky top-0 z-20 shadow-sm flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-800">Verifikasi Data Diri</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Tahap Akhir Aktivasi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Kelompok Input: Biodata */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 inline-block">1. Informasi Pribadi</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap (Sesuai KTP)</label>
              <input type="text" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Induk Kependudukan (NIK)</label>
              <input type="text" required maxLength={16}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({...formData, nik: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium appearance-none"
                  onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">No. WhatsApp</label>
                <input type="tel" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Kelompok Input: Pekerjaan & Dokumen */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 inline-block">2. Pekerjaan & Dokumen</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Instansi (Kampus/Perusahaan)</label>
              <input type="text" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({...formData, pekerjaan_instansi: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Unggah Foto Identitas (KTP)</label>
              <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer">
                <input type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                {previewUrl ? (
                  <img src={previewUrl} className="h-32 mx-auto rounded-lg shadow-sm" alt="Preview KTP" />
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 text-indigo-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    </div>
                    <p className="text-xs font-bold text-gray-500">Tap untuk memilih foto</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kelompok Input: Darurat */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 inline-block">3. Kontak Darurat</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Kontak</label>
                <input type="text" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  onChange={(e) => setFormData({...formData, darurat_nama: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Hubungan</label>
                <input type="text" required placeholder="Cth: Orang Tua"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  onChange={(e) => setFormData({...formData, darurat_hubungan: e.target.value})} />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">No. Handphone Darurat</label>
              <input type="tel" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={(e) => setFormData({...formData, darurat_hp: e.target.value})} />
            </div>
          </div>

          {/* Action Button Bottom */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-gray-100 z-30">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold rounded-xl py-4 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'MEMPROSES DATA...' : 'SIMPAN PROFIL SAYA'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}