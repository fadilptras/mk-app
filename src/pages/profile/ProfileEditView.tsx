import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ProfileEditView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email || '');
    };
    getUser();
  }, []);

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
      if (!user) throw new Error('Sesi berakhir, silakan login ulang.');

      let fotoKtpUrl = null;

      if (fotoKtpFile) {
        const fileExt = fotoKtpFile.name.split('.').pop();
        const filePath = `ktp/${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('berkas_penghuni')
          .upload(filePath, fotoKtpFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('berkas_penghuni').getPublicUrl(filePath);
        fotoKtpUrl = data.publicUrl;
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ ...formData, user_id: user.id, foto_ktp: fotoKtpUrl }]);
      if (profileError) throw profileError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ is_profile_complete: true })
        .eq('id', user.id);
      if (updateError) throw updateError;

      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans text-gray-900">
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative pb-24">
        
        {/* Sticky App Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-4 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Lengkapi Data Diri</h1>
          <p className="text-sm text-gray-500 truncate">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {/* Card 1: Informasi Pribadi */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
              Informasi Pribadi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama Sesuai KTP</label>
                <input 
                  type="text" required placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nomor Induk Kependudukan (NIK)</label>
                <input 
                  type="text" required maxLength={16} placeholder="16 Digit NIK"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Jenis Kelamin</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
                    onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">No. WhatsApp</label>
                  <input 
                    type="tel" required placeholder="0812..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pekerjaan & Dokumen */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
              Pekerjaan & Dokumen
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Instansi / Kampus / Perusahaan</label>
                <input 
                  type="text" required placeholder="Tempat kerja atau kuliah"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={(e) => setFormData({...formData, pekerjaan_instansi: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Unggah Foto KTP</label>
                <div className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                  <input 
                    type="file" accept="image/*" required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview KTP" className="h-32 object-contain rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-xs text-gray-500 font-medium">Tap untuk pilih foto KTP</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Kontak Darurat */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
              Kontak Darurat
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama Kontak</label>
                  <input 
                    type="text" required placeholder="Nama lengkap"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    onChange={(e) => setFormData({...formData, darurat_nama: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Hubungan</label>
                  <input 
                    type="text" required placeholder="Cth: Ayah, Ibu"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    onChange={(e) => setFormData({...formData, darurat_hubungan: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nomor Handphone</label>
                <input 
                  type="tel" required placeholder="08..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={(e) => setFormData({...formData, darurat_hp: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Button */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold rounded-xl py-3.5 text-sm shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Menyimpan Data...
                </>
              ) : 'Simpan Profil'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}