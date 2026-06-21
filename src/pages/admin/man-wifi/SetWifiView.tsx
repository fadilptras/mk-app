import { useState, useEffect } from "react";
import { useSetWifi } from "../../../hooks/admin/wifi/useSetWifi";
import { Wifi, Lock, Eye, EyeOff, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SetWifiView() {
  // Panggil hook dengan nama baru
  const { wifiSettings, loading, isUpdating, updateWifiSettings } = useSetWifi();
  const [wifiData, setWifiData] = useState({ ssid: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (wifiSettings) {
      setWifiData({ ssid: wifiSettings.ssid, password: wifiSettings.password });
    }
  }, [wifiSettings]);

  const handleSaveWifi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiData.ssid || !wifiData.password) {
      toast.error("SSID dan Password tidak boleh kosong!");
      return;
    }
    await updateWifiSettings(wifiData.ssid, wifiData.password);
  };

  return (
    <div className="px-5 mt-6 space-y-5 pb-10 max-w-2xl mx-auto">
      <Toaster position="top-center" />
      
      <div>
        <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">
          Konfigurasi WiFi Kos
        </h1>
        <p className="text-[#7A93B5] text-xs font-medium mt-1">
          Atur SSID dan kata sandi internet yang akan dilihat oleh penghuni
        </p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           <div className="h-20 bg-slate-100 rounded-3xl w-full"></div>
           <div className="h-20 bg-slate-100 rounded-3xl w-full"></div>
        </div>
      ) : (
        <form 
          onSubmit={handleSaveWifi} 
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(13,47,92,0.05)] space-y-6"
        >
          <div>
            <label htmlFor="wifi_ssid" className="text-[10px] font-black text-[#7A93B5] uppercase mb-2 block tracking-widest">
              Nama Jaringan (SSID)
            </label>
            <div className="relative">
              <Wifi className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
              <input
                id="wifi_ssid"
                type="text"
                placeholder="Contoh: Kos Mutiara 5G"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-[#0D2F5C] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:font-medium"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="wifi_pass" className="text-[10px] font-black text-[#7A93B5] uppercase mb-2 block tracking-widest">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="wifi_pass"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi WiFi..."
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:font-medium"
                value={wifiData.password}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-medium">
              *Penghuni dapat melihat kredensial ini di dashboard aplikasi mereka.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-[#0D2F5C] text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all hover:bg-blue-900 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isUpdating ? "MENGAMANKAN DATA..." : "PERBARUI WIFI KOS"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}