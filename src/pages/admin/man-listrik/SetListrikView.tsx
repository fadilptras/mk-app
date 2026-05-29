import { useState } from "react";
import { useAdminData } from "../../../hooks/useAdminData";

export default function SetListrikView() {
  const { rooms, isSubmitting, updateRoomElectricity } = useAdminData();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [tokenListrik, setTokenListrik] = useState("");

  const handleUpdateListrik = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !tokenListrik)
      return alert("Silakan tentukan kamar dan nomor token!");

    const result = await updateRoomElectricity(selectedRoom, tokenListrik);
    if (result.success) {
      alert("Meteran / Token listrik kamar berhasil diperbarui di database!");
      setTokenListrik("");
      setSelectedRoom("");
    } else {
      alert(`Gagal memperbarui token: ${result.message}`);
    }
  };

  return (
    <div className="px-5 mt-6 space-y-4">
      <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">
        Input Token / Meter Listrik
      </h3>
      <form
        onSubmit={handleUpdateListrik}
        className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4"
      >
        <div>
          <label
            htmlFor="elect_room"
            className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
          >
            Pilih Kamar Target
          </label>
          <select
            id="elect_room"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">-- Pilih Kamar --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Kamar {room.room_number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="elect_token"
            className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block"
          >
            Nomor Token / Meteran
          </label>
          <input
            id="elect_token"
            type="text"
            placeholder="Masukkan ID Meteran"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 text-center tracking-widest"
            value={tokenListrik}
            onChange={(e) => setTokenListrik(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all hover:bg-blue-700"
        >
          {isSubmitting ? "MENYIMPAN..." : "KIRIM DATA KE DATABASE"}
        </button>
      </form>
    </div>
  );
}
