import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../hooks/useAdminData';

export default function AdminDashboardView() {
  const navigate = useNavigate();
  const { penghuni, rooms, loading, isSubmitting, createAccount, addRoom } = useAdminData();
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  
  // State Form Kamar
  const [roomData, setRoomData] = useState({ nomor: '', tipe: 'Standar', harga: 1500000 });
  
  // State Form Akun
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    role: 'penghuni',
    kamar_id: '', // Menggunakan kamar_id
    tanggal_masuk: ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addRoom(roomData.nomor, roomData.tipe, roomData.harga);
    if (result.success) {
      alert('Kamar berhasil ditambahkan!');
      setRoomData({ nomor: '', tipe: 'Standar', harga: 1500000 });
      setShowRoomModal(false);
    } else {
      alert(`Gagal: ${result.message}`);
    }
  };

  const handleTambahAkun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kamar_id) return alert('Silakan pilih kamar!');
    const result = await createAccount(formData);
    if (result.success) {
      alert('Akun berhasil dibuat! Password default: Mutiara123');
      setShowUserModal(false);
      setFormData({ nama_lengkap: '', email: '', role: 'penghuni', kamar_id: '', tanggal_masuk: '' });
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
              <h1 className="text-xl font-black text-white tracking-tight">Manajemen Properti</h1>
            </div>
            <button 
                onClick={handleLogout} 
                className="bg-rose-500/20 text-rose-400 p-2.5 rounded-xl border border-rose-500/30" 
                aria-label="Logout"
                title="Keluar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

        <div className="px-5 mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setShowRoomModal(true)} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-left active:scale-95 transition-all">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Kamar</p>
              <p className="text-3xl font-black text-indigo-600">{rooms.length}</p>
              <span className="text-[9px] font-black text-indigo-400 uppercase mt-2 block">+ TAMBAH KAMAR</span>
            </button>
            <button onClick={() => setShowUserModal(true)} className="bg-indigo-600 p-5 rounded-3xl border border-indigo-500 shadow-lg text-white text-left active:scale-95 transition-all">
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Penghuni</p>
              <p className="text-3xl font-black">{penghuni.length}</p>
              <span className="text-[9px] font-black text-white/80 uppercase mt-2 block">+ TAMBAH AKUN</span>
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Penghuni Aktif</h3>
            {loading ? ( <p className="text-center text-xs py-10 text-gray-400">Loading...</p> ) : (
              penghuni.map((p) => {
                 // Mencari detail kamar berdasarkan kamar_id dari user
                const userRoom = rooms.find(r => r.id === p.kamar_id);
                return (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">{userRoom?.nomor_kamar || '--'}</div>
                        <div>
                        <p className="text-xs font-black text-gray-800">{p.nama_lengkap || p.email}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{p.email}</p>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-black uppercase ${p.is_profile_complete ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {p.is_profile_complete ? 'Verified' : 'Pending'}
                    </div>
                    </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL TAMBAH KAMAR */}
        {showRoomModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-800">Tambah Unit Kamar</h2>
                <button onClick={() => setShowRoomModal(false)} className="text-gray-400" aria-label="Close"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <form onSubmit={handleTambahKamar} className="space-y-4">
                <div>
                  <label htmlFor="room_num" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nomor Kamar</label>
                  <input id="room_num" type="text" required placeholder="Contoh: A-10" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                    value={roomData.nomor} onChange={(e) => setRoomData({...roomData, nomor: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="room_type" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Tipe Kamar</label>
                  <select id="room_type" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                      value={roomData.tipe} onChange={(e) => setRoomData({...roomData, tipe: e.target.value})}>
                      <option value="Standar">Standar</option>
                      <option value="VIP">VIP</option>
                    </select>
                </div>
                <div>
                  <label htmlFor="room_price" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Harga (Rp)</label>
                  <input id="room_price" type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                    value={roomData.harga} onChange={(e) => setRoomData({...roomData, harga: Number(e.target.value)})} />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all">
                  {isSubmitting ? 'MEMPROSES...' : 'TAMBAHKAN KAMAR'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH AKUN */}
        {showUserModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-800">Daftarkan Penghuni</h2>
                <button onClick={() => setShowUserModal(false)} className="text-gray-400" aria-label="Close"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <form onSubmit={handleTambahAkun} className="space-y-4">
                <div>
                  <label htmlFor="reg_nama" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nama Lengkap</label>
                  <input id="reg_nama" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                    value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="reg_email" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Email</label>
                  <input id="reg_email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg_kamar" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Pilih Kamar</label>
                    <select id="reg_kamar" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.kamar_id} onChange={(e) => setFormData({...formData, kamar_id: e.target.value})}>
                      <option value="">-- Pilih --</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>{room.nomor_kamar}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg_role" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Role</label>
                    <select id="reg_role" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                      value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                      <option value="penghuni">Penghuni</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="reg_tgl" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Tanggal Masuk</label>
                  <input id="reg_tgl" type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase" 
                    value={formData.tanggal_masuk} onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})} />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-all">
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