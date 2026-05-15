import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../hooks/useAdminData';

export default function AdminDashboardView() {
  const navigate = useNavigate();
  const { penghuni, loading, isSubmitting, createAccount } = useAdminData();
  
  const [showModal, setShowModal] = useState(false);
  
  // State form lengkap sesuai permintaan baru
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    role: 'penghuni',
    kamar: '',
    tanggal_masuk: ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleTambahAkun = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createAccount(formData);

    if (result.success) {
      alert('Akun berhasil dibuat! Password default adalah: Mutiara123');
      setShowModal(false);
      setFormData({ nama_lengkap: '', email: '', role: 'penghuni', kamar: '', tanggal_masuk: '' });
    } else {
      alert(`Gagal: ${result.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC]">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 pt-10 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest mb-1">Mutiara Kost Admin</p>
              <h1 className="text-xl font-black text-white tracking-tight">Manajemen Akun</h1>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-rose-500/20 text-rose-400 p-2.5 rounded-xl border border-rose-500/30"
              aria-label="Keluar"
              title="Keluar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

        <div className="px-5 mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total User</p>
              <p className="text-3xl font-black text-indigo-600">{penghuni.length}</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 p-5 rounded-3xl border border-indigo-500 shadow-lg text-white active:scale-95 transition-all"
            >
              <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
              <span className="text-[10px] font-black uppercase">Tambah Akun</span>
            </button>
          </div>

          {/* Daftar User */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Daftar Penghuni Aktif</h3>
            {loading ? (
              <p className="text-center text-xs font-bold text-gray-400">Loading...</p>
            ) : (
              penghuni.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                      {p.kamar || '--'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800">{p.nama_lengkap || p.email}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Masuk: {p.tanggal_masuk || '-'}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[9px] font-black uppercase">Aktif</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Form Tambah Akun Lengkap */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-800">Tambah Akun Baru</h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400"
                  aria-label="Tutup"
                  title="Tutup"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleTambahAkun} className="space-y-4">
                <div>
                  <label htmlFor="inputNama" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nama Lengkap</label>
                  <input 
                    id="inputNama"
                    type="text" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                    value={formData.nama_lengkap} 
                    onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} 
                  />
                </div>
                <div>
                  <label htmlFor="inputEmail" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Email</label>
                  <input 
                    id="inputEmail"
                    type="email" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="inputKamar" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">No. Kamar</label>
                    <input 
                      id="inputKamar"
                      type="text" 
                      required 
                      placeholder="Contoh: A-01" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                      value={formData.kamar} 
                      onChange={(e) => setFormData({...formData, kamar: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label htmlFor="inputRole" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Role</label>
                    <select 
                      id="inputRole"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                      value={formData.role} 
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="penghuni">Penghuni</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="inputTanggal" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Tanggal Masuk</label>
                  <input 
                    id="inputTanggal"
                    type="date" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase" 
                    value={formData.tanggal_masuk} 
                    onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})} 
                  />
                </div>
                
                <p className="text-[9px] text-gray-400 font-bold italic">* Password otomatis diatur menjadi: Mutiara123</p>

                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl mt-2 disabled:opacity-50">
                  {isSubmitting ? 'MENYIMPAN...' : 'KONFIRMASI & BUAT'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}