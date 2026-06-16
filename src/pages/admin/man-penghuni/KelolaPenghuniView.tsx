import { useState, useMemo } from 'react';
import { useManagePenghuni, type PenghuniAdmin } from '../../../hooks/admin/penghuni/useManagePenghuni';
import { useCreatePenghuni } from '../../../hooks/admin/penghuni/useCreatePenghuni';
import { formatDate } from '../../../utils/formatters';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Filter, User, Info, Edit, XCircle, Save, Phone, CreditCard, CalendarDays, FileWarning, UserPlus, Trash2, Key } from 'lucide-react';

export default function KelolaPenghuniView() {
  // 1. Inisialisasi Hooks Baru
  const { penghuni, rooms, loading, isUpdating, updatePenghuni, deletePenghuni, resetPassword, refresh } = useManagePenghuni();
  const { createAccount, isCreating } = useCreatePenghuni();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');

  // State Modals
  const [selectedUser, setSelectedUser] = useState<PenghuniAdmin | null>(null);
  const [editUser, setEditUser] = useState<PenghuniAdmin | null>(null);
  const [modalTambahOpen, setModalTambahOpen] = useState(false);

  // State Form Edit
  const [formData, setFormData] = useState({
    status_akun: '',
    tanggal_masuk: '',
    tanggal_tagihan: '',
    no_rek_pembayaran: '',
    nama_rek_pembayaran: '',
    room_id: ''
  });

  // State Form Tambah
  const [createData, setCreateData] = useState({
    email: '',
    kamar_id: '',
    tanggal_masuk: '',
    tanggal_tagihan: '',
    biaya_sewa: '',
    biaya_deposit: '',
    no_rek_pembayaran: '',
    nama_rek_pembayaran: ''
  });

  // Logika Filter
  const filteredPenghuni = useMemo(() => {
    return penghuni.filter((item) => {
      const name = item.profile?.nama_lengkap?.toLowerCase() || '';
      // Tambahan ?. untuk mencegah crash jika email kosong
      const email = item.email?.toLowerCase() || ''; 
      const matchSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());

      let matchStatus = true;
      if (filterStatus === 'aktif') matchStatus = item.status_akun === 'aktif';
      if (filterStatus === 'incomplete') matchStatus = !item.is_profile_complete;
      if (filterStatus === 'noroom') matchStatus = !item.room;

      const matchRoom = filterRoom === 'all' || item.room?.room_number === filterRoom;

      return matchSearch && matchStatus && matchRoom;
    });
  }, [penghuni, searchQuery, filterStatus, filterRoom]);

  // Handler Edit
  const handleOpenEdit = (user: PenghuniAdmin) => {
    setEditUser(user);
    setFormData({
      status_akun: user.status_akun || 'belum_aktif',
      tanggal_masuk: user.tanggal_masuk || '',
      tanggal_tagihan: user.tanggal_tagihan || '',
      no_rek_pembayaran: user.no_rek_pembayaran || '',
      nama_rek_pembayaran: user.nama_rek_pembayaran || '',
      room_id: user.room_id || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    const payload = {
      status_akun: formData.status_akun,
      tanggal_masuk: formData.tanggal_masuk || null,
      tanggal_tagihan: formData.tanggal_tagihan || null,
      no_rek_pembayaran: formData.no_rek_pembayaran || null,
      nama_rek_pembayaran: formData.nama_rek_pembayaran || null,
      room_id: formData.room_id || null
    };

    const success = await updatePenghuni(editUser.id, payload);
    if (success) setEditUser(null);
  };

  // Handler Tambah Penghuni
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.email) return toast.error("Email wajib diisi!");

    const result = await createAccount(createData);
    if (result.success) {
      setModalTambahOpen(false);
      // Reset form setelah berhasil
      setCreateData({
        email: '', kamar_id: '', tanggal_masuk: '', tanggal_tagihan: '',
        biaya_sewa: '', biaya_deposit: '', no_rek_pembayaran: '', nama_rek_pembayaran: ''
      });
      refresh(); // Refresh data tabel
    }
  };

  return (
    <div className="px-5 mt-6 space-y-5 pb-10">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">Kelola Penghuni</h1>
          <p className="text-[#7A93B5] text-xs font-medium mt-1">Data profil dan administrasi akun</p>
        </div>
        <button 
          onClick={() => setModalTambahOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 md:px-5 md:py-3 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          <span className="hidden md:inline font-black text-[10px] uppercase tracking-widest">Tambah Penghuni</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari nama atau email penghuni..." 
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-slate-600"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Akun Aktif</option>
              <option value="incomplete">Profil Belum Lengkap</option>
              <option value="noroom">Tanpa Kamar</option>
            </select>
          </div>
          <div className="relative flex-1 md:w-40">
            <select 
              className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border-none text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-slate-600"
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              <option value="all">Semua Kamar</option>
              {rooms.map(r => (
                <option key={r.id} value={r.room_number}>Kamar {r.room_number}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Penghuni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mx-auto mb-3"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Memuat Penghuni...</p>
          </div>
        ) : filteredPenghuni.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <p className="text-slate-400 text-sm font-bold">Tidak ada penghuni yang sesuai filter.</p>
          </div>
        ) : (
          filteredPenghuni.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                  {user.profile?.foto_diri ? (
                    <img src={user.profile.foto_diri} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><User className="w-6 h-6" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-[#0D2F5C] truncate">
                    {user.profile?.nama_lengkap || 'Belum Isi Profil'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${user.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {user.status_akun}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center border border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kamar</p>
                  <p className="text-xs font-bold text-slate-700">{user.room ? user.room.room_number : 'Belum Diatur'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nunggak</p>
                  <p className={`text-xs font-black ${user.unpaid_bills > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {user.unpaid_bills} Bulan
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="flex-1 py-2.5 bg-slate-50 text-slate-600 hover:bg-[#0D2F5C] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" /> Detail
                </button>
                <button 
                  onClick={() => handleOpenEdit(user)}
                  className="flex-1 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm(`Yakin ingin reset password ${user.email} ke PasswordKost123! ?`)) resetPassword(user.id);
                  }}
                  disabled={isUpdating}
                  className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all"
                  title="Reset Password"
                >
                  <Key className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm(`HAPUS PERMANEN akun ${user.email}? Semua data akan hilang!`)) deletePenghuni(user.id);
                  }}
                  disabled={isUpdating}
                  className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                  title="Hapus Penghuni"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: TAMBAH PENGHUNI */}
      {modalTambahOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><UserPlus className="w-4 h-4" /> Undangan Penghuni</h2>
              <button title="Batal" aria-label="Batal" onClick={() => setModalTambahOpen(false)} className="text-white/70 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAccount}>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Email (Untuk Login)</label>
                  <input 
                    type="email" required placeholder="email@contoh.com"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={createData.email} onChange={(e) => setCreateData({...createData, email: e.target.value})}
                  />
                  <p className="text-[9px] text-blue-500 mt-1 font-medium italic">*Password default: PasswordKost123!</p>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Alokasi Kamar (Opsional)</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={createData.kamar_id} onChange={(e) => setCreateData({...createData, kamar_id: e.target.value})}
                  >
                    <option value="">-- Pilih Kamar --</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>Kamar {r.room_number}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Tgl Masuk</label>
                    <input 
                      type="date" required
                      className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold"
                      value={createData.tanggal_masuk} onChange={(e) => setCreateData({...createData, tanggal_masuk: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Tgl Tagihan</label>
                    <input 
                      type="number" min="1" max="31" placeholder="Cth: 15" required
                      className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold"
                      value={createData.tanggal_tagihan} onChange={(e) => setCreateData({...createData, tanggal_tagihan: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Biaya Sewa</label>
                    <input 
                      type="number" placeholder="Rp"
                      className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold"
                      value={createData.biaya_sewa} onChange={(e) => setCreateData({...createData, biaya_sewa: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Deposit</label>
                    <input 
                      type="number" placeholder="Rp"
                      className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold"
                      value={createData.biaya_deposit} onChange={(e) => setCreateData({...createData, biaya_deposit: e.target.value})}
                    />
                  </div>
                </div>

                {/* INPUT REKENING PEMBAYARAN BARU DI SINI */}
                <div className="pt-2">
                  <p className="text-[#0D2F5C] font-black text-xs uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Info Rekening Pembayaran</p>
                  <div className="space-y-3">
                    <input 
                      type="text" placeholder="Bank & No Rekening (Cth: BCA 123456)"
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      value={createData.no_rek_pembayaran} onChange={(e) => setCreateData({...createData, no_rek_pembayaran: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Atas Nama Rekening"
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      value={createData.nama_rek_pembayaran} onChange={(e) => setCreateData({...createData, nama_rek_pembayaran: e.target.value})}
                    />
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button type="button" onClick={() => setModalTambahOpen(false)} className="px-5 py-2.5 rounded-xl font-black text-slate-500 hover:bg-slate-200 uppercase tracking-widest text-[10px]">
                  Batal
                </button>
                <button type="submit" disabled={isCreating} className="px-5 py-2.5 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 uppercase tracking-widest text-[10px] flex items-center gap-1.5 disabled:opacity-50">
                  <UserPlus className="w-3.5 h-3.5" /> {isCreating ? 'Mendaftarkan...' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL LENGKAP */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#0D2F5C] text-white">
              <h2 className="text-sm font-black uppercase tracking-widest">Detail Penghuni</h2>
              <button title="Tutup Modal" aria-label="Tutup" onClick={() => setSelectedUser(null)} className="text-white/70 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Info KTP */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FileWarning className="w-3.5 h-3.5" /> Foto KTP</p>
                <div className="bg-slate-100 rounded-2xl h-40 flex items-center justify-center overflow-hidden">
                  {selectedUser.profile?.foto_ktp ? (
                    <img src={selectedUser.profile.foto_ktp} alt="KTP" className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-xs font-bold text-slate-400 uppercase">Belum Upload KTP</p>
                  )}
                </div>
              </div>

              {/* Data Diri */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                  <p className="font-bold text-sm text-slate-800">{selectedUser.profile?.nama_lengkap || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIK</p>
                    <p className="font-bold text-xs text-slate-800">{selectedUser.profile?.nik || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Kelamin</p>
                    <p className="font-bold text-xs text-slate-800 capitalize">{selectedUser.profile?.jenis_kelamin || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No. WhatsApp</p>
                  <p className="font-bold text-sm text-blue-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {selectedUser.profile?.no_whatsapp || '-'}
                  </p>
                </div>
              </div>

              {/* Data Administrasi Kost */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Tgl Masuk</p>
                  <p className="font-bold text-xs text-slate-700">{formatDate(selectedUser.tanggal_masuk)}</p>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Siklus Tagihan</p>
                  <p className="font-bold text-xs text-slate-700">Tgl {selectedUser.tanggal_tagihan || '-'} / bulan</p>
                </div>
                <div className="col-span-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status Kontrak</p>
                  <p className="font-black text-emerald-800 text-sm">
                    {selectedUser.active_contract ? 'Memiliki Kontrak Aktif' : 'Tidak Ada Kontrak Aktif'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-6 py-2.5 rounded-xl font-black text-white bg-[#0D2F5C] hover:bg-blue-900 transition-colors uppercase tracking-widest text-[10px]">
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA ADMIN */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Edit className="w-4 h-4" /> Edit Data Admin</h2>
              <button title="Batal" aria-label="Batal" onClick={() => setEditUser(null)} className="text-white/70 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs font-medium">
                  Mengubah data untuk: <strong>{editUser.email}</strong>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Status Akun</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={formData.status_akun} onChange={(e) => setFormData({...formData, status_akun: e.target.value})}
                  >
                    <option value="belum_aktif">Belum Aktif</option>
                    <option value="aktif">Aktif</option>
                    <option value="non_aktif">Non Aktif / Keluar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Alokasi Kamar</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={formData.room_id} onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                  >
                    <option value="">-- Cabut Kamar --</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>Kamar {r.room_number}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Tgl Masuk</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold"
                      value={formData.tanggal_masuk} onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1.5">Tgl Tagihan</label>
                    <input 
                      type="number" min="1" max="31"
                      className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold"
                      value={formData.tanggal_tagihan} onChange={(e) => setFormData({...formData, tanggal_tagihan: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[#0D2F5C] font-black text-xs uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Info Rekening Pembayaran</p>
                  <div className="space-y-3">
                    <input 
                      type="text" placeholder="No Rekening..."
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      value={formData.no_rek_pembayaran} onChange={(e) => setFormData({...formData, no_rek_pembayaran: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Atas Nama..."
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      value={formData.nama_rek_pembayaran} onChange={(e) => setFormData({...formData, nama_rek_pembayaran: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button type="button" onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-xl font-black text-slate-500 hover:bg-slate-200 uppercase tracking-widest text-[10px]">
                  Batal
                </button>
                <button type="submit" disabled={isUpdating} className="px-5 py-2.5 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 uppercase tracking-widest text-[10px] flex items-center gap-1.5 disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" /> {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}