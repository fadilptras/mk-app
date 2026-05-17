import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';

export default function KelolaKamarView() {
  const { rooms, loading, isSubmitting, addRoom } = useAdminData();
  const [roomData, setRoomData] = useState({ nomor: '', tipe: 'Standar', harga: 1500000 });

  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addRoom(roomData.nomor, roomData.tipe, roomData.harga);
    if (result.success) {
      alert('Kamar berhasil ditambahkan!');
      setRoomData({ nomor: '', tipe: 'Standar', harga: 1500000 });
    } else {
      alert(`Gagal: ${result.message}`);
    }
  };

  return (
    <div className="px-5 mt-6 space-y-6">
      {/* Form Tambah Kamar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">Tambah Unit Kamar</h3>
        <form onSubmit={handleTambahKamar} className="space-y-4">
          <div>
            <label htmlFor="room_num" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nomor Kamar</label>
            <input id="room_num" type="text" required placeholder="Contoh: A-10" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
              value={roomData.nomor} onChange={(e) => setRoomData({...roomData, nomor: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="room_type" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Tipe Kamar</label>
              <select id="room_type" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                value={roomData.tipe} onChange={(e) => setRoomData({...roomData, tipe: e.target.value})}>
                <option value="Standar">Standar</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label htmlFor="room_price" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Harga Bulanan (Rp)</label>
              <input id="room_price" type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                value={roomData.harga} onChange={(e) => setRoomData({...roomData, harga: Number(e.target.value)})} />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all hover:bg-indigo-700">
            {isSubmitting ? 'MEMPROSES...' : 'TAMBAHKAN UNIT KAMAR'}
          </button>
        </form>
      </div>

      {/* List Kamar Terdaftar */}
      <div className="space-y-3">
        <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Daftar Kamar ({rooms.length})</h3>
        {loading ? ( <p className="text-center text-xs py-6 text-gray-400">Loading data kamar...</p> ) : (
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-wider">{room.tipe_kamar}</span>
                  <p className="text-xl font-black text-slate-800 mt-1">Kamar {room.nomor_kamar}</p>
                </div>
                <p className="text-xs font-bold text-indigo-600 mt-3">Rp {room.harga_bulanan?.toLocaleString('id-ID')}/bln</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}