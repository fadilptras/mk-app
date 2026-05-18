import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ProfileState {
  nama_lengkap: string;
  nik: string;
  no_whatsapp: string;
  jenis_kelamin: string;
  pekerjaan_instansi: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_asal: string;
  agama: string;
  status_pernikahan: string;
  darurat_nama: string;
  darurat_hp: string;
  darurat_whatsapp: string;
  darurat_hubungan: string;
  darurat_alamat: string;
  foto_diri: string;
  foto_ktp: string;
}

export default function ProfileEditView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State untuk file upload & preview
  const [fotoDiriFile, setFotoDiriFile] = useState<File | null>(null);
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [fotoDiriPreview, setFotoDiriPreview] = useState<string | null>(null);
  const [fotoKtpPreview, setFotoKtpPreview] = useState<string | null>(null);

  // Referensi input file tersembunyi
  const fotoDiriRef = useRef<HTMLInputElement>(null);
  const fotoKtpRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileState>({
    nama_lengkap: '', nik: '', no_whatsapp: '', jenis_kelamin: 'L',
    pekerjaan_instansi: '', tempat_lahir: '', tanggal_lahir: '', alamat_asal: '',
    agama: '', status_pernikahan: '', darurat_nama: '', darurat_hp: '',
    darurat_whatsapp: '', darurat_hubungan: '', darurat_alamat: '',
    foto_diri: '', foto_ktp: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate('/auth');
          return;
        }

        setUserId(user.id);

        // Menarik data yang sudah ada di database untuk mengisi form
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          setForm({
            nama_lengkap: profile.nama_lengkap || '',
            nik: profile.nik || '',
            no_whatsapp: profile.no_whatsapp || '',
            jenis_kelamin: profile.jenis_kelamin || 'L',
            pekerjaan_instansi: profile.pekerjaan_instansi || '',
            tempat_lahir: profile.tempat_lahir || '',
            tanggal_lahir: profile.tanggal_lahir || '',
            alamat_asal: profile.alamat_asal || '',
            agama: profile.agama || '',
            status_pernikahan: profile.status_pernikahan || '',
            darurat_nama: profile.darurat_nama || '',
            darurat_hp: profile.darurat_hp || '',
            darurat_whatsapp: profile.darurat_whatsapp || '',
            darurat_hubungan: profile.darurat_hubungan || '',
            darurat_alamat: profile.darurat_alamat || '',
            foto_diri: profile.foto_diri || '',
            foto_ktp: profile.foto_ktp || '',
          });

          // Set preview jika foto sudah pernah diupload sebelumnya
          if (profile.foto_diri) setFotoDiriPreview(profile.foto_diri);
          if (profile.foto_ktp) setFotoKtpPreview(profile.foto_ktp);
        }
      } catch (error) {
        console.error('Gagal memuat profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'diri' | 'ktp') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === 'diri') {
      setFotoDiriFile(file);
      setFotoDiriPreview(previewUrl);
    } else {
      setFotoKtpFile(file);
      setFotoKtpPreview(previewUrl);
    }
  };

  // Fungsi helper untuk upload gambar ke Supabase Storage
  const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (!userId) throw new Error("User ID tidak ditemukan");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('berkas_penghuni') // Asumsi nama bucket kamu
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('berkas_penghuni')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      setStatusMessage({ type: 'success', text: 'Sedang menyimpan data...' });

      let finalFotoDiriUrl = form.foto_diri;
      let finalFotoKtpUrl = form.foto_ktp;

      // 1. Upload Foto Diri (Jika ada file baru yang dipilih)
      if (fotoDiriFile) {
        setStatusMessage({ type: 'success', text: 'Mengunggah foto profil...' });
        finalFotoDiriUrl = await uploadImage(fotoDiriFile, 'identitas_diri');
      }

      // 2. Upload Foto KTP (Jika ada file baru yang dipilih)
      if (fotoKtpFile) {
        setStatusMessage({ type: 'success', text: 'Mengunggah foto KTP...' });
        finalFotoKtpUrl = await uploadImage(fotoKtpFile, 'identitas_ktp');
      }

      // 3. Simpan semua data ke tabel user_profiles
      setStatusMessage({ type: 'success', text: 'Memperbarui profil...' });
      const finalData = {
        user_id: userId,
        ...form,
        foto_diri: finalFotoDiriUrl,
        foto_ktp: finalFotoKtpUrl,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(finalData, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      // 4. Update status di tabel users
      const { error: userError } = await supabase
        .from('users')
        .update({ is_profile_complete: true })
        .eq('id', userId);

      if (userError) throw userError;

      setStatusMessage({ type: 'success', text: '✅ Profil & Berkas berhasil diperbarui!' });
      
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error: any) {
      console.error('Gagal menyimpan profil:', error);
      setStatusMessage({ type: 'error', text: `Gagal: ${error.message || 'Terjadi kesalahan'}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-gray-800">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC] shadow-inner">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-700 pt-6 pb-12 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="flex items-center gap-4 relative z-10 text-white">
            <button onClick={() => navigate('/dashboard')} className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">Data Diri Penghuni</h1>
              <p className="text-[11px] text-indigo-200 font-bold uppercase tracking-wide">Lengkapi berkas hunian Mutiara Kost</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 -mt-6 relative z-20 space-y-6">
          
          {statusMessage && (
            <div className={`p-4 rounded-2xl text-xs font-black uppercase border tracking-wider shadow-sm flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              {statusMessage.text}
            </div>
          )}

          {/* SECTION 1: INFORMASI UTAMA */}
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-xs text-indigo-700 uppercase tracking-widest border-b pb-2">I. Informasi Pribadi</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
              <input type="text" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Masukkan nama lengkap" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</label>
              <input type="text" name="nik" value={form.nik} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="16 digit nomor NIK" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">No. WhatsApp</label>
                <input type="text" name="no_whatsapp" value={form.no_whatsapp} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="0812..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Jenis Kelamin</label>
                <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors">
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pekerjaan / Instansi</label>
              <input type="text" name="pekerjaan_instansi" value={form.pekerjaan_instansi} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Mahasiswa / Nama Perusahaan" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tempat Lahir</label>
                <input type="text" name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Kota Lahir" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tanggal Lahir</label>
                <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Agama</label>
                <input type="text" name="agama" value={form.agama} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Agama" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Status Pernikahan</label>
                <input type="text" name="status_pernikahan" value={form.status_pernikahan} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Belum / Kawin" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Alamat Asal (Sesuai KTP)</label>
              <textarea name="alamat_asal" value={form.alamat_asal} onChange={handleChange} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Alamat asal lengkap..." />
            </div>
          </div>

          {/* SECTION 2: KONTAK DARURAT */}
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-xs text-rose-600 uppercase tracking-widest border-b pb-2">II. Kontak Darurat</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nama Kontak</label>
                <input type="text" name="darurat_nama" value={form.darurat_nama} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Nama kerabat" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Hubungan</label>
                <input type="text" name="darurat_hubungan" value={form.darurat_hubungan} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Orang Tua / Saudara" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">No. Handphone</label>
                <input type="text" name="darurat_hp" value={form.darurat_hp} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="08..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">WhatsApp Darurat</label>
                <input type="text" name="darurat_whatsapp" value={form.darurat_whatsapp} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="08..." />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Alamat Darurat</label>
              <textarea name="darurat_alamat" value={form.darurat_alamat} onChange={handleChange} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Alamat lengkap penanggung jawab..." />
            </div>
          </div>

          {/* SECTION 3: BERKAS & FOTO (Dipindah ke bawah) */}
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-black text-xs text-amber-600 uppercase tracking-widest border-b pb-2">III. Berkas & Identitas Visual</h3>
            
            <div className="flex gap-4 items-center">
              {/* FOTO PROFIL */}
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div 
                  onClick={() => fotoDiriRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer relative group"
                >
                  {fotoDiriPreview ? (
                    <img src={fotoDiriPreview} alt="Preview Diri" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  ) : (
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold">Ubah</span>
                  </div>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase text-center">Foto Diri</p>
                <input type="file" ref={fotoDiriRef} onChange={(e) => handleFileChange(e, 'diri')} accept="image/*" className="hidden" />
              </div>

              {/* FOTO KTP */}
              <div className="flex flex-col gap-2 w-2/3">
                <div 
                  onClick={() => fotoKtpRef.current?.click()}
                  className="w-full h-20 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer relative group"
                >
                  {fotoKtpPreview ? (
                    <img src={fotoKtpPreview} alt="Preview KTP" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-amber-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Upload KTP</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold">Ubah KTP</span>
                  </div>
                </div>
                <input type="file" ref={fotoKtpRef} onChange={(e) => handleFileChange(e, 'ktp')} accept="image/*" className="hidden" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-gradient-to-r from-indigo-800 to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 text-white font-black text-xs tracking-wider uppercase py-4 rounded-2xl shadow-md transform active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pembaruan'}
          </button>

        </form>
      </div>
    </div>
  );
}