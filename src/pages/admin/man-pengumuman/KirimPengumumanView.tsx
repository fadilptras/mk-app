import { useState } from "react";
import { useManagePengumuman } from "../../../hooks/admin/pengumuman/useManagePengumuman";
import { Send, Trash2, Megaphone, Inbox } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function KirimPengumumanView() {
  const { announcements, loading, sendAnnounce, deleteAnnounce } = useManagePengumuman();
  const [formData, setFormData] = useState({ title: "", content: "", type: "info" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendAnnounce(formData);
    if (success) setFormData({ title: "", content: "", type: "info" });
  };

  return (
    <div className="px-5 mt-6 pb-10 space-y-6 max-w-2xl mx-auto">
      <Toaster position="top-center" />
      <div>
        <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">Papan Pengumuman</h1>
        <p className="text-[#7A93B5] text-xs font-medium mt-1">Buat pengumuman untuk semua penghuni</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(13,47,92,0.05)] space-y-4">
        <select
          title="Tipe Pengumuman"
          className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="info">Info</option>
          <option value="warning">Peringatan</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <input
          required
          placeholder="Judul Pengumuman"
          className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-black text-[#0D2F5C] outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          required
          rows={4}
          placeholder="Isi pengumuman..."
          className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <button className="w-full bg-[#0D2F5C] text-white py-4 rounded-2xl font-black text-[10px] uppercase flex justify-center gap-2 transition-transform active:scale-95">
          <Send className="w-4 h-4" /> Share ke Penghuni
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-3">
        {loading ? (
           <div className="text-center py-10 animate-pulse text-slate-400 text-xs font-bold uppercase">Memuat pengumuman...</div>
        ) : announcements.length === 0 ? (
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
             <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">KOSONG!</p>
             <p className="text-slate-400 text-[10px] font-medium mt-1">Belum ada pengumuman yang dipasang.</p>
           </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start group hover:border-blue-200 transition-all">
              <div className="flex gap-3">
                <div className={`p-2 rounded-xl h-fit ${a.type === 'maintenance' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#0D2F5C] uppercase tracking-widest">{a.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{a.content}</p>
                </div>
              </div>
              <button
                onClick={() => { if(confirm("Hapus pengumuman ini?")) deleteAnnounce(a.id) }}
                className="text-rose-400 p-2 hover:bg-rose-50 rounded-lg transition-colors"
                title="Hapus Pengumuman"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}