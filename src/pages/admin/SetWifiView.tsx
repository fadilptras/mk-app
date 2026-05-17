import { useState, useEffect } from 'react';
import { useAdminData } from '../../hooks/useAdminData';

export default function SetWifiView() {
  const { wifiSettings, isSubmitting, updateWifiSettings } = useAdminData();
  const [wifiData, setWifiData] = useState({ ssid: '', password: '' });

  useEffect(() => {
    if (wifiSettings) {
      setWifiData({ ssid: wifiSettings.ssid || '', password: wifiSettings.password || '' });
    }
  }, [wifiSettings]);

  const handleSaveWifi = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateWifiSettings(wifiData.ssid, wifiData.password);
    if (result.success) { alert('Kredensial WiFi kos berhasil disinkronkan ke database!'); } 
    else { alert(`Gagal menyimpan: ${result.message}`); }
  };

  return (
    <div className="px-5 mt-6 space-y-4">
      <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">Konfigurasi WiFi Kos</h3>
      <form onSubmit={handleSaveWifi} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label htmlFor="wifi_ssid" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Nama SSID (WiFi Name)</label>
          <input id="wifi_ssid" type="text" placeholder="Nama Jaringan WiFi" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" 
            value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} />
        </div>
        <div>
          <label htmlFor="wifi_pass" className="text-[10px] font-black text-[#7A93B5] uppercase mb-1 block">Kata Sandi (Password)</label>
          <input id="wifi_pass" type="text" placeholder="Masukkan Password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600" 
            value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all hover:bg-blue-700">
          {isSubmitting ? 'MENYIMPAN...' : 'PERBARUI WIFI DI DATABASE'}
        </button>
      </form>
    </div>
  );
}