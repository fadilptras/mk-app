import { useState } from 'react';

export default function SetWifiView() {
  const [wifiData, setWifiData] = useState({ ssid: 'Mutiara_Kost_Premium', password: 'kostmutiara2026' });

  const handleSaveWifi = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Akses WiFi Kos diperbarui!\nSSID: ${wifiData.ssid}`);
  };

  return (
    <div className="px-5 mt-6 space-y-4">
      <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Konfigurasi WiFi Kos</h3>
      
      <form onSubmit={handleSaveWifi} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <label htmlFor="wifi_ssid" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nama SSID (WiFi Name)</label>
          <input id="wifi_ssid" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} />
        </div>
        <div>
          <label htmlFor="wifi_pass" className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Kata Sandi (WPA2 Password)</label>
          <input id="wifi_pass" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all hover:bg-indigo-700">
          PERBARUI PASSWOD WIFI
        </button>
      </form>
    </div>
  );
}