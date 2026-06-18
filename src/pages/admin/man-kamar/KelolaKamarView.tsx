import { useState } from "react";
import { useManageKamar, type RoomAdmin } from "../../../hooks/admin/kamar/useManageKamar";
import toast, { Toaster } from "react-hot-toast";

export default function KelolaKamarView() {
  const { rooms, loading, isUpdating, addRoom, updateRoom, deleteRoom } = useManageKamar();
  
  const [formData, setFormData] = useState({
    nomor: "",
    meter_number: "",
    meter_name: "",
  });

  const [editingRoom, setEditingRoom] = useState<RoomAdmin | null>(null);
  const [editFormData, setEditFormData] = useState({
    room_number: "",
    status: "",
    meter_number: "",
    meter_name: "",
  });

  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomor) return toast.error("Nomor kamar tidak boleh kosong!");
    
    const success = await addRoom(formData.nomor, formData.meter_number, formData.meter_name);
    if (success) {
      setFormData({ nomor: "", meter_number: "", meter_name: "" });
    }
  };

  const handleDelete = async (room: RoomAdmin) => {
    if (window.confirm(`HAPUS PERMANEN Kamar ${room.room_number}? Data yang dihapus tidak dapat dikembalikan.`)) {
      await deleteRoom(room.id, room.room_number, room.penghuni_count);
    }
  };

  const openEditModal = (room: RoomAdmin) => {
    setEditingRoom(room);
    setEditFormData({
      room_number: room.room_number || "",
      status: room.status || "AVAILABLE",
      meter_number: room.meter_number || "",
      meter_name: room.meter_name || "",
    });
  };

  const handleSimpanEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    // Proteksi UI: Mencegah ubah ke AVAILABLE jika ada penghuni
    if (editingRoom.penghuni_count > 0 && editFormData.status === 'AVAILABLE') {
      return toast.error("Kamar ini masih berpenghuni. Tidak bisa diubah ke AVAILABLE.");
    }

    const success = await updateRoom(editingRoom.id, editFormData, editingRoom.room_number);
    if (success) setEditingRoom(null);
  };

  return (
    <div className="px-5 mt-6 space-y-6 pb-10">
      <Toaster position="top-center" />
      
      {/* Form Tambah Kamar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight">
          Tambah Unit Kamar
        </h3>
        <form onSubmit={handleTambahKamar} className="space-y-4">
          <div>
            <label htmlFor="room_num" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">
              Nomor Kamar
            </label>
            <input
              id="room_num" type="text" required placeholder="Contoh: A-10"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              value={formData.nomor}
              onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="meter_num" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">
                No Meteran PLN
              </label>
              <input
                id="meter_num" type="text" placeholder="112233..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                value={formData.meter_number}
                onChange={(e) => setFormData({ ...formData, meter_number: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="meter_name" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">
                Nama Meteran
              </label>
              <input
                id="meter_name" type="text" placeholder="Atas Nama"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                value={formData.meter_name}
                onChange={(e) => setFormData({ ...formData, meter_name: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit" disabled={isUpdating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {isUpdating ? "MENYIMPAN..." : "TAMBAHKAN UNIT KAMAR"}
          </button>
        </form>
      </div>

      {/* List Kamar */}
      <div className="space-y-3">
        <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">
          Daftar Kamar ({rooms.length})
        </h3>
        {loading ? (
          <div className="text-center py-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mx-auto mb-3"></div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Memuat Kamar...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
            <p className="text-slate-400 text-sm font-bold">Belum ada data kamar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      room.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                      room.status === "MAINTENANCE" ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {room.status}
                    </span>
                    {/* Badge Penghuni Dinamis */}
                    {room.penghuni_count > 0 && (
                      <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full text-[8px] font-black" title="Terisi">
                        👤 {room.penghuni_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-black text-[#0D2F5C] mt-2 truncate">
                    Kamar {room.room_number}
                  </p>
                </div>
                
                {room.meter_number && (
                  <p className="text-[9px] font-bold text-slate-400 mt-3 pt-3 border-t border-slate-50 uppercase truncate" title={room.meter_name || ''}>
                    ⚡ {room.meter_number}
                  </p>
                )}
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button onClick={() => openEditModal(room)} className="flex-1 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg text-[9px] font-black tracking-widest transition-colors">
                    EDIT
                  </button>
                  <button 
                    onClick={() => handleDelete(room)} 
                    className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white py-2 rounded-lg text-[9px] font-black tracking-widest transition-colors"
                  >
                    HAPUS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL EDIT */}
      {editingRoom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#0D2F5C]">Edit Kamar</h2>
              <button onClick={() => setEditingRoom(null)} aria-label="Tutup" className="text-slate-400 hover:text-rose-500 bg-slate-50 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSimpanEdit} className="space-y-4">
              {/* Peringatan jika kamar diisi */}
              {editingRoom.penghuni_count > 0 && (
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-3">
                  <p className="text-[10px] text-rose-600 font-bold leading-relaxed">
                    Kamar ini sedang dihuni oleh {editingRoom.penghuni_count} orang. Status tidak bisa diubah ke AVAILABLE.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="edit_room_num" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">
                  Nomor Kamar
                </label>
                <input
                  id="edit_room_num" type="text" required placeholder="A-10"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  value={editFormData.room_number}
                  onChange={(e) => setEditFormData({ ...editFormData, room_number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit_meter_num" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">No Meteran</label>
                  <input
                    id="edit_meter_num" type="text" placeholder="Kosongkan jika tidak ada"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={editFormData.meter_number}
                    onChange={(e) => setEditFormData({ ...editFormData, meter_number: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="edit_meter_name" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Nama Meteran</label>
                  <input
                    id="edit_meter_name" type="text" placeholder="Atas Nama"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={editFormData.meter_name}
                    onChange={(e) => setEditFormData({ ...editFormData, meter_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="edit_status" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Status</label>
                <select
                  id="edit_status"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="AVAILABLE" disabled={editingRoom.penghuni_count > 0}>AVAILABLE (Kosong)</option>
                  <option value="OCCUPIED">OCCUPIED (Terisi)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Perbaikan)</option>
                </select>
              </div>
              <button
                type="submit" disabled={isUpdating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {isUpdating ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}