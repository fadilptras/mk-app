import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';

export default function KelolaPenghuniView() {
  const { penghuni, rooms, loading, isSubmitting, createAccount } = useAdminData();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    email: '', role: 'penghuni', kamar_id: '',
    tanggal_masuk: '', tanggal_tagihan: '',
    biaya_sewa: '', biaya_deposit: '',
    no_rek_pembayaran: '', nama_rek_pembayaran: ''
  });

  const handleTambahAkun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kamar_id) return alert('Silakan pilih kamar!');
    const result = await createAccount(formData);
    if (result.success) {
      alert('Akun berhasil dibuat! Password default: Mutiara123');
      setShowForm(false);
      setFormData({
        email: '', role: 'penghuni', kamar_id: '', tanggal_masuk: '',
        tanggal_tagihan: '', biaya_sewa: '', biaya_deposit: '',
        no_rek_pembayaran: '', nama_rek_pembayaran: ''
      });
    } else {
      alert(`Gagal: ${result.message}`);
    }
  };

  return (
    <div className="px-5 mt-6 space-y-6">
      {/* Tombol Toggle Form / List */}
      <button 
        onClick={() => setShowForm(!showForm)} 
        className={`w-full font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all ${
          showForm ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white'
        }`}
      >
        {showForm ? '← Lihat Daftar Penghuni' : '+ Daftarkan Penghuni Baru'}
      </button>

      {showForm ? (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">Form Registrasi Penghuni</h3>
          <form onSubmit={handleTambahAkun} className="space-y-4">
            <div>
              <label htmlFor="reg_email" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Email Akun</label>
              <input id="reg_email" type="email" required placeholder="name@email.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_kamar" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Pilih Unit Kamar</label>
                <select id="reg_kamar" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.kamar_id} onChange={(e) => setFormData({...formData, kamar_id: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.nomor_kamar}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reg_role" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Hak Akses (Role)</label>
                <select id="reg_role" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="penghuni">Penghuni</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_tgl_masuk" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Tanggal Masuk</label>
                <input id="reg_tgl_masuk" type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.tanggal_masuk} onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reg_tgl_tagihan" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Siklus Tagihan</label>
                <input id="reg_tgl_tagihan" type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.tanggal_tagihan} onChange={(e) => setFormData({...formData, tanggal_tagihan: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_biaya_sewa" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Biaya Sewa (Rp)</label>
                <input id="reg_biaya_sewa" type="number" required placeholder="1500000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.biaya_sewa} onChange={(e) => setFormData({...formData, biaya_sewa: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reg_biaya_deposit" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Uang Deposit (Rp)</label>
                <input id="reg_biaya_deposit" type="number" required placeholder="500000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.biaya_deposit} onChange={(e) => setFormData({...formData, biaya_deposit: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_no_rek" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nomor Rekening</label>
                <input id="reg_no_rek" type="text" required placeholder="0987xxxx" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.no_rek_pembayaran} onChange={(e) => setFormData({...formData, no_rek_pembayaran: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reg_nama_rek" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Pemilik Rekening</label>
                <input id="reg_nama_rek" type="text" required placeholder="Atas Nama" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.nama_rek_pembayaran} onChange={(e) => setFormData({...formData, nama_rek_pembayaran: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl mt-2 shadow-lg active:scale-95 transition-all hover:bg-indigo-700">
              {isSubmitting ? 'MENYIMPAN DATA...' : 'KONFIRMASI & REGISTER PENGHUNI'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Penghuni Aktif ({penghuni.length})</h3>
          {loading ? ( <p className="text-center text-xs py-10 text-gray-400">Loading...</p> ) : (
            penghuni.map((p) => {
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
      )}
    </div>
  );
}