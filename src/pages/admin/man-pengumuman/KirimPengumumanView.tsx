import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { Send, Trash2 } from "lucide-react";

export default function KirimPengumumanView() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  // Menghapus 'loading' karena tidak digunakan di UI
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("announcements").insert([formData]);
    if (error) toast.error("Gagal share pengumuman");
    else {
      toast.success("Pengumuman terpasang!");
      setFormData({ title: "", content: "", type: "info" });
      fetchAnnouncements();
    }
  };

  const deleteAnnounce = async (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnnouncements();
  };

  return (
    <div className="px-5 mt-6 pb-10 space-y-6">
      <Toaster />
      <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">
        Papan Pengumuman
      </h1>

      {/* FORM INPUT */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4"
      >
        <select
          title="Tipe Pengumuman"
          className="w-full p-3 bg-slate-50 rounded-xl text-xs font-black uppercase"
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
          className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          required
          rows={4}
          placeholder="Isi pengumuman..."
          className="w-full p-3 bg-slate-50 rounded-xl text-sm font-medium"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <button className="w-full bg-[#0D2F5C] text-white py-4 rounded-xl font-black text-[10px] uppercase flex justify-center gap-2">
          <Send className="w-4 h-4" /> Share ke Penghuni
        </button>
      </form>

      {/* DAFTAR PENGUMUMAN */}
      <div className="space-y-3">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-start"
          >
            <div>
              <p className="text-xs font-black text-[#0D2F5C] uppercase">
                {a.title}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">{a.content}</p>
            </div>
            <button
              onClick={() => deleteAnnounce(a.id)}
              className="text-rose-400 p-2"
              title="Hapus Pengumuman"
              aria-label="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
