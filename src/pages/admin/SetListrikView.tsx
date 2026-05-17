import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';

export default function SetListrikView() {
  const { rooms } = useAdminData();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [tokenListrik, setTokenListrik] = useState('');

  const handleUpdateListrik = (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedRoom || !tokenListrik) return alert('Lengkapi data kamar dan nomor token!');
    alert(`Token listrik berhasil diperbarui untuk Kamar ID: ${selectedRoom}\nNomor Token: ${tokenListrik}`);
    setTokenListrik('');
  };

  return (
    <div className="px-5 mt-6 space-y-4">
      <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Input Token Listrik Kamar</h3>
      
      <form onSubmit={handleUpdateListrik} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <label htmlFor="elect_room" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Pilih Kamar Target</label>
          <select 
            id="elect_room"
            required 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedRoom} 
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">-- Pilih Kamar --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>Kamar {room.nomor_kamar}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="elect_token" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nomor Token Listrik (20 Digit)</label>
          <input 
            id="elect_token"
            type="text" 
            maxLength={23}
            placeholder="XXXX - XXXX - XXXX - XXXX - XXXX" 
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest text-center" 
            value={tokenListrik} 
            onChange={(e) => setTokenListrik(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all hover:bg-indigo-700">
          KIRIM TOKEN KE PENGHUNI
        </button>
      </form>
    </div>
  );
}