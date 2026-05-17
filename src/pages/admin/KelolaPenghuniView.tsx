import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';

export default function KelolaPenghuniView() {
  const { penghuni, rooms, loading, isSubmitting, createAccount, updateUser, deleteUser } = useAdminData();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    email: '', role: 'penghuni', kamar_id: '', tanggal_masuk: '', tanggal_tagihan: '',
    biaya_sewa: '', biaya_deposit: '', no_rek_pembayaran: '', nama_rek_pembayaran: ''
  });

  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const handleTambahAkun = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createAccount(formData);
    if (result.success) {
      alert('Akun berhasil dibuat!');
      setShowForm(false);
      setFormData({ email: '', role: 'penghuni', kamar_id: '', tanggal_masuk: '', tanggal_tagihan: '', biaya_sewa: '', biaya_deposit: '', no_rek_pembayaran: '', nama_rek_pembayaran: '' });
    } else { alert(`Gagal mendaftar: ${result.message}`); }
  };

  const handleDelete = async (id: string, email: string) => {
    if (window.confirm(`Hapus permanen akun ${email}?\nData terkait (laporan dll) mungkin ikut terhapus jika terhubung.`)) {
      const result = await deleteUser(id);
      if (result.success) alert('Akun berhasil dihapus.');
      else alert(`Gagal menghapus: ${result.message}`);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user.id);
    setEditData({ 
      room_id: user.room_id || '', role: user.role, tanggal_masuk: user.tanggal_masuk || '', tanggal_tagihan: user.tanggal_tagihan || '',
      biaya_sewa: user.biaya_sewa || '', biaya_deposit: user.biaya_deposit || '', is_profile_complete: user.is_profile_complete
    });
  };

  const handleSimpanEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const result = await updateUser(editingUser, editData);
    if (result.success) { alert('Data penghuni diperbarui!'); setEditingUser(null); }
    else { alert(`Gagal update: ${result.message}`); }
  };

  return (
    <div className="px-5 mt-6 space-y-6">
      <button onClick={() => setShowForm(!showForm)} className={`w-full font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all ${showForm ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}>
        {showForm ? '← Lihat Daftar Penghuni' : '+ Daftarkan Akun Baru'}
      </button>

      {showForm ? (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight">Registrasi Akun Baru</h3>
          <form onSubmit={handleTambahAkun} className="space-y-4">
            <div>
              <label htmlFor="reg_email" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Email Akun</label>
              <input id="reg_email" type="email" placeholder="contoh@email.com" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_role" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Hak Akses</label>
                <select id="reg_role" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="penghuni">Penghuni</option><option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="reg_kamar" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Pilih Kamar</label>
                <select id="reg_kamar" disabled={formData.role === 'admin'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 disabled:opacity-50" value={formData.kamar_id} onChange={(e) => setFormData({...formData, kamar_id: e.target.value})}>
                  <option value="">-- Kosong --</option>
                  {rooms.map((room) => (<option key={room.id} value={room.id}>Kamar {room.room_number}</option>))}
                </select>
              </div>
            </div>

            {formData.role === 'penghuni' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg_tgl_masuk" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Tgl Masuk</label>
                    <input id="reg_tgl_masuk" type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.tanggal_masuk} onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="reg_tgl_tagihan" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Tgl Tagihan</label>
                    <input id="reg_tgl_tagihan" type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.tanggal_tagihan} onChange={(e) => setFormData({...formData, tanggal_tagihan: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg_biaya_sewa" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Biaya Sewa</label>
                    <input id="reg_biaya_sewa" type="number" placeholder="1500000" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.biaya_sewa} onChange={(e) => setFormData({...formData, biaya_sewa: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="reg_biaya_deposit" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Deposit</label>
                    <input id="reg_biaya_deposit" type="number" placeholder="500000" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.biaya_deposit} onChange={(e) => setFormData({...formData, biaya_deposit: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg_no_rek" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">No Rekening</label>
                    <input id="reg_no_rek" type="text" placeholder="No Rekening" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.no_rek_pembayaran} onChange={(e) => setFormData({...formData, no_rek_pembayaran: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="reg_nama_rek" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Atas Nama</label>
                    <input id="reg_nama_rek" type="text" placeholder="Atas Nama" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={formData.nama_rek_pembayaran} onChange={(e) => setFormData({...formData, nama_rek_pembayaran: e.target.value})} />
                  </div>
                </div>
              </>
            )}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl mt-2 shadow-lg active:scale-95 transition-all hover:bg-blue-700">
              {isSubmitting ? 'MENYIMPAN DATA...' : 'KONFIRMASI & BUAT AKUN'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">Akun Terdaftar ({penghuni.length})</h3>
          {loading ? ( <p className="text-center text-xs py-10 text-slate-400">Loading...</p> ) : (
            penghuni.map((p) => {
              const userRoom = rooms.find(r => r.id === p.room_id);
              return (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {userRoom?.room_number || (p.role === 'admin' ? 'ADM' : '--')}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0D2F5C] truncate max-w-[150px]">{p.email}</p>
                        <p className="text-[9px] font-bold text-[#7A93B5] uppercase mt-0.5">{p.role}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-black uppercase ${p.is_profile_complete ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {p.is_profile_complete ? 'Lengkap' : 'Pending'}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                    <button onClick={() => openEditModal(p)} className="flex-1 bg-slate-50 text-slate-600 py-1.5 rounded-lg text-[9px] font-black tracking-widest hover:bg-slate-100">EDIT</button>
                    <button onClick={() => handleDelete(p.id, p.email)} className="flex-1 bg-rose-50 text-rose-600 py-1.5 rounded-lg text-[9px] font-black tracking-widest hover:bg-rose-100">HAPUS</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- MODAL EDIT PENGHUNI --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#0D2F5C]">Edit Data Penghuni</h2>
              {/* Diperbaiki: Menambahkan aria-label */}
              <button onClick={() => setEditingUser(null)} aria-label="Tutup Modal" className="text-slate-400 hover:text-rose-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSimpanEdit} className="space-y-4">
              <div>
                {/* Diperbaiki: Menambahkan htmlFor, id */}
                <label htmlFor="edit_kamar" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Pindah Kamar</label>
                <select id="edit_kamar" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={editData.room_id} onChange={(e) => setEditData({...editData, room_id: e.target.value})}>
                  <option value="">-- Tidak Ada / Hapus Kamar --</option>
                  {rooms.map((room) => (<option key={room.id} value={room.id}>Kamar {room.room_number}</option>))}
                </select>
              </div>
              <div>
                {/* Diperbaiki: Menambahkan htmlFor, id, placeholder */}
                <label htmlFor="edit_biaya_sewa" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Update Biaya Sewa (Rp)</label>
                <input id="edit_biaya_sewa" type="number" placeholder="Contoh: 1500000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" value={editData.biaya_sewa} onChange={(e) => setEditData({...editData, biaya_sewa: Number(e.target.value)})} />
              </div>
              <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100 mt-2">
                <input type="checkbox" id="reset_profile" checked={!editData.is_profile_complete} onChange={(e) => setEditData({...editData, is_profile_complete: !e.target.checked})} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                <label htmlFor="reset_profile" className="text-xs font-bold text-orange-800">Paksa Reset Status Profil (Meminta user isi ulang data diri)</label>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-all">SIMPAN PERUBAHAN</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}