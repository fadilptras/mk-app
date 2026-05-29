import { useState } from "react";
import { useAdminData } from "../../../hooks/useAdminData";

export default function KelolaKamarView() {
  const { rooms, loading, isSubmitting, addRoom, updateRoom, deleteRoom } =
    useAdminData();
  const [formData, setFormData] = useState({
    nomor: "",
    meter_number: "",
    meter_name: "",
  });

  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    room_number: "",
    status: "",
    meter_number: "",
    meter_name: "",
  });

  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomor) return alert("Nomor kamar tidak boleh kosong!");
    const result = await addRoom(
      formData.nomor,
      formData.meter_number,
      formData.meter_name,
    );
    if (result.success) {
      alert("Kamar berhasil ditambahkan!");
      setFormData({ nomor: "", meter_number: "", meter_name: "" });
    } else {
      alert(`Gagal menyimpan: ${result.message}`);
    }
  };

  const handleDelete = async (id: string, roomNum: string) => {
    if (window.confirm(`Yakin ingin menghapus Kamar ${roomNum}?`)) {
      const result = await deleteRoom(id);
      if (result.success) alert("Kamar berhasil dihapus.");
      else alert(`Gagal menghapus: ${result.message}`);
    }
  };

  const openEditModal = (room: any) => {
    setEditingRoom(room.id);
    setEditFormData({
      room_number: room.room_number || "",
      status: room.status || "AVAILABLE",
      meter_number: room.meter_number || "",
      meter_name: room.meter_name || "",
    });
  };

  const handleSimpanEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateRoom(editingRoom, editFormData);
    if (result.success) {
      alert("Data kamar berhasil diperbarui!");
      setEditingRoom(null);
    } else {
      alert(`Gagal update: ${result.message}`);
    }
  };

  return (
    <div className="px-5 mt-6 space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight">
          Tambah Unit Kamar
        </h3>
        <form onSubmit={handleTambahKamar} className="space-y-4">
          <div>
            <label
              htmlFor="room_num"
              className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
            >
              Nomor Kamar
            </label>
            <input
              id="room_num"
              type="text"
              required
              placeholder="Contoh: A-10"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600"
              value={formData.nomor}
              onChange={(e) =>
                setFormData({ ...formData, nomor: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="meter_num"
                className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
              >
                No Meteran
              </label>
              <input
                id="meter_num"
                type="text"
                placeholder="112233..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600"
                value={formData.meter_number}
                onChange={(e) =>
                  setFormData({ ...formData, meter_number: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="meter_name"
                className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
              >
                Nama Meteran
              </label>
              <input
                id="meter_name"
                type="text"
                placeholder="Atas Nama"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600"
                value={formData.meter_name}
                onChange={(e) =>
                  setFormData({ ...formData, meter_name: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all"
          >
            {isSubmitting ? "MENYIMPAN..." : "TAMBAHKAN UNIT KAMAR"}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">
          Daftar Kamar ({rooms.length})
        </h3>
        {loading ? (
          <p className="text-center text-xs py-6 text-slate-400">
            Loading data kamar...
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${room.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {room.status || "AVAILABLE"}
                  </span>
                  <p className="text-xl font-black text-[#0D2F5C] mt-2">
                    Kamar {room.room_number}
                  </p>
                </div>
                {room.meter_number && (
                  <p className="text-[9px] font-bold text-slate-400 mt-3 pt-3 border-t border-slate-50 uppercase truncate">
                    PLN: {room.meter_number}
                  </p>
                )}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => openEditModal(room)}
                    className="flex-1 bg-slate-50 text-slate-600 py-1.5 rounded-lg text-[9px] font-black tracking-widest hover:bg-slate-100"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(room.id, room.room_number)}
                    className="flex-1 bg-rose-50 text-rose-600 py-1.5 rounded-lg text-[9px] font-black tracking-widest hover:bg-rose-100"
                  >
                    HAPUS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingRoom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#0D2F5C]">Edit Kamar</h2>
              {/* Diperbaiki: Menambahkan aria-label */}
              <button
                onClick={() => setEditingRoom(null)}
                aria-label="Tutup Modal"
                className="text-slate-400 hover:text-rose-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSimpanEdit} className="space-y-4">
              <div>
                {/* Diperbaiki: Menambahkan htmlFor, id, dan placeholder */}
                <label
                  htmlFor="edit_room_num"
                  className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
                >
                  Nomor Kamar
                </label>
                <input
                  id="edit_room_num"
                  type="text"
                  required
                  placeholder="A-10"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600"
                  value={editFormData.room_number}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      room_number: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="edit_meter_num"
                    className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
                  >
                    No Meteran
                  </label>
                  <input
                    id="edit_meter_num"
                    type="text"
                    placeholder="Nomor Meter"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600"
                    value={editFormData.meter_number}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        meter_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit_meter_name"
                    className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
                  >
                    Nama Meteran
                  </label>
                  <input
                    id="edit_meter_name"
                    type="text"
                    placeholder="Atas Nama"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600"
                    value={editFormData.meter_name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        meter_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="edit_status"
                  className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
                >
                  Status
                </label>
                <select
                  id="edit_status"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-blue-600"
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                >
                  <option value="AVAILABLE">AVAILABLE (Kosong)</option>
                  <option value="OCCUPIED">OCCUPIED (Terisi)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Perbaikan)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-all"
              >
                SIMPAN PERUBAHAN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
