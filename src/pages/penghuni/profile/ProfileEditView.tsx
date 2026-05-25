import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

interface ProfileState {
  nama_lengkap: string;
  nik: string;
  no_whatsapp: string;
  jenis_kelamin: string;
  pekerjaan_instansi: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_asal: string;
  agama: string;
  status_pernikahan: string;
  darurat_nama: string;
  darurat_hp: string;
  darurat_whatsapp: string;
  darurat_hubungan: string;
  darurat_alamat: string;
  foto_diri: string;
  foto_ktp: string;
}

export default function ProfileEditView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const [fotoDiriFile, setFotoDiriFile] = useState<File | null>(null);
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [fotoDiriPreview, setFotoDiriPreview] = useState<string>("");
  const [fotoKtpPreview, setFotoKtpPreview] = useState<string>("");

  const fotoDiriRef = useRef<HTMLInputElement>(null);
  const fotoKtpRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileState>({
    nama_lengkap: "",
    nik: "",
    no_whatsapp: "",
    jenis_kelamin: "L",
    pekerjaan_instansi: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat_asal: "",
    agama: "",
    status_pernikahan: "",
    darurat_nama: "",
    darurat_hp: "",
    darurat_whatsapp: "",
    darurat_hubungan: "",
    darurat_alamat: "",
    foto_diri: "",
    foto_ktp: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
    setTimeout(
      () => setToast({ show: false, type: "success", message: "" }),
      3000,
    );
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate("/auth");
          return;
        }

        setUserId(user.id);

        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          setFormData({
            nama_lengkap: profile.nama_lengkap || "",
            nik: profile.nik || "",
            no_whatsapp: profile.no_whatsapp || "",
            jenis_kelamin: profile.jenis_kelamin || "L",
            pekerjaan_instansi: profile.pekerjaan_instansi || "",
            tempat_lahir: profile.tempat_lahir || "",
            tanggal_lahir: profile.tanggal_lahir || "",
            alamat_asal: profile.alamat_asal || "",
            agama: profile.agama || "",
            status_pernikahan: profile.status_pernikahan || "",
            darurat_nama: profile.darurat_nama || "",
            darurat_hp: profile.darurat_hp || "",
            darurat_whatsapp: profile.darurat_whatsapp || "",
            darurat_hubungan: profile.darurat_hubungan || "",
            darurat_alamat: profile.darurat_alamat || "",
            foto_diri: profile.foto_diri || "",
            foto_ktp: profile.foto_ktp || "",
          });

          if (profile.foto_diri) setFotoDiriPreview(profile.foto_diri);
          if (profile.foto_ktp) setFotoKtpPreview(profile.foto_ktp);
        }
      } catch (error: any) {
        console.error("Gagal memuat profil:", error);
        showToast("error", "Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "diri" | "ktp",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Ukuran file maksimal 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "diri") {
      setFotoDiriFile(file);
      setFotoDiriPreview(previewUrl);
    } else {
      setFotoKtpFile(file);
      setFotoKtpPreview(previewUrl);
    }
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (!userId) throw new Error("User ID tidak ditemukan");

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("berkas_penghuni")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("berkas_penghuni")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) return;
    setSaving(true);

    try {
      let finalFotoDiriUrl = formData.foto_diri;
      let finalFotoKtpUrl = formData.foto_ktp;

      if (fotoDiriFile) {
        showToast("success", "Mengunggah foto profil...");
        finalFotoDiriUrl = await uploadImage(fotoDiriFile, "identitas_diri");
      }
      if (fotoKtpFile) {
        showToast("success", "Mengunggah foto KTP...");
        finalFotoKtpUrl = await uploadImage(fotoKtpFile, "identitas_ktp");
      }

      const finalData = {
        user_id: userId,
        ...formData,
        foto_diri: finalFotoDiriUrl,
        foto_ktp: finalFotoKtpUrl,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert(finalData, { onConflict: "user_id" });

      if (profileError) throw profileError;

      const { error: userError } = await supabase
        .from("users")
        .update({ is_profile_complete: true })
        .eq("id", userId);

      if (userError) throw userError;

      showToast("success", "Profil berhasil diperbarui!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      showToast("error", `Gagal: ${error.message || "Terjadi kesalahan"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-20">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0]">
        {/* HEADER */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              title="Kembali"
              className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-black text-white tracking-tight">
              Edit Profil
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            aria-label="Simpan Profil"
            title="Simpan Profil"
            className={`text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl ${saving ? "bg-indigo-400 text-indigo-100" : "bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95"} transition-all shadow-sm`}
          >
            {saving ? "..." : "SIMPAN"}
          </button>
        </div>

        <form onSubmit={handleSave} className="px-5 pt-6 pb-4">
          {/* AVATAR SECTION */}
          <div className="bg-white rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

            <div className="relative group mt-2">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-50 shadow-md bg-indigo-100 flex items-center justify-center">
                {fotoDiriPreview ? (
                  <img
                    src={fotoDiriPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-indigo-400 font-black uppercase">
                    {formData.nama_lengkap.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fotoDiriRef.current?.click()}
                aria-label="Ubah Foto Profil"
                title="Ubah Foto Profil"
                className="absolute bottom-0 right-0 w-9 h-9 bg-pink-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <input
                id="foto_diri"
                aria-label="Upload Foto Profil"
                title="Upload Foto Profil"
                type="file"
                accept="image/*"
                ref={fotoDiriRef}
                onChange={(e) => handleFileChange(e, "diri")}
                className="hidden"
              />
            </div>
            <p
              className="mt-4 text-[11px] font-black text-indigo-700 uppercase tracking-widest cursor-pointer active:scale-95 transition-transform"
              onClick={() => fotoDiriRef.current?.click()}
            >
              Ubah Foto Profil
            </p>
          </div>

          <div className="space-y-4">
            {/* INFORMASI PRIBADI (ACCORDION) */}
            <CollapsibleSection
              title="Data Pribadi"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
              defaultOpen={true}
            >
              <InputGroup
                label="Nama Lengkap"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleInputChange}
                placeholder="Sesuai KTP"
              />
              <InputGroup
                label="NIK (Nomor Induk Kependudukan)"
                name="nik"
                value={formData.nik}
                onChange={handleInputChange}
                type="number"
                placeholder="16 Digit Angka"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Tempat Lahir"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  placeholder="Kota Lahir"
                />
                <InputGroup
                  label="Tanggal Lahir"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>

              <SelectGroup
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleInputChange}
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </SelectGroup>

              <div className="grid grid-cols-2 gap-4">
                <SelectGroup
                  label="Agama"
                  name="agama"
                  value={formData.agama}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </SelectGroup>
                <SelectGroup
                  label="Status"
                  name="status_pernikahan"
                  value={formData.status_pernikahan}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Status</option>
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                </SelectGroup>
              </div>
            </CollapsibleSection>

            {/* KONTAK & PEKERJAAN (ACCORDION) */}
            <CollapsibleSection
              title="Kontak & Domisili"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
            >
              <InputGroup
                label="Nomor WhatsApp"
                name="no_whatsapp"
                value={formData.no_whatsapp}
                onChange={handleInputChange}
                type="tel"
                placeholder="08xxxxxxxxx"
              />
              <InputGroup
                label="Pekerjaan / Instansi"
                name="pekerjaan_instansi"
                value={formData.pekerjaan_instansi}
                onChange={handleInputChange}
                placeholder="Contoh: Mahasiswa - Univ Pakuan"
              />
              <div>
                <label
                  htmlFor="alamat_asal"
                  className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1"
                >
                  Alamat Asal
                </label>
                <textarea
                  id="alamat_asal"
                  name="alamat_asal"
                  value={formData.alamat_asal}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Alamat lengkap sesuai domisili asli..."
                  className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-4 py-3.5 text-[13px] font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium focus:bg-indigo-50/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none resize-none shadow-sm"
                />
              </div>
            </CollapsibleSection>

            {/* KONTAK DARURAT (ACCORDION) */}
            <CollapsibleSection
              title="Kontak Darurat"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
            >
              <InputGroup
                label="Nama Kontak Darurat"
                name="darurat_nama"
                value={formData.darurat_nama}
                onChange={handleInputChange}
                placeholder="Nama Keluarga / Kerabat"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Hubungan"
                  name="darurat_hubungan"
                  value={formData.darurat_hubungan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Ayah / Kakak"
                />
                <InputGroup
                  label="Nomor Telepon/WA"
                  name="darurat_hp"
                  value={formData.darurat_hp}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="08xxxxxxxxx"
                />
              </div>
            </CollapsibleSection>

            {/* DOKUMEN IDENTITAS (ACCORDION) */}
            <CollapsibleSection
              title="Verifikasi Dokumen"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              }
            >
              <label
                htmlFor="foto_ktp"
                className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1"
              >
                Kartu Tanda Penduduk (KTP)
              </label>
              <div
                onClick={() => fotoKtpRef.current?.click()}
                className={`w-full aspect-[1.6/1] rounded-2xl border-2 border-dashed ${fotoKtpPreview ? "border-indigo-500 bg-indigo-50/30" : "border-indigo-200 bg-indigo-50/50"} flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-indigo-50 transition-colors relative group`}
              >
                {fotoKtpPreview ? (
                  <>
                    <img
                      src={fotoKtpPreview}
                      alt="KTP"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl border border-white/30">
                        Ubah Foto KTP
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-indigo-400">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-indigo-500">
                      Tap Untuk Upload KTP
                    </p>
                  </div>
                )}
                <input
                  id="foto_ktp"
                  aria-label="Upload Foto KTP"
                  title="Upload Foto KTP"
                  type="file"
                  accept="image/*"
                  ref={fotoKtpRef}
                  onChange={(e) => handleFileChange(e, "ktp")}
                  className="hidden"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold px-1">
                Pastikan foto KTP terlihat jelas dan tidak terpotong untuk
                keperluan verifikasi.
              </p>
            </CollapsibleSection>
          </div>
        </form>

        {/* Notifikasi Toast Custom */}
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 backdrop-blur-md w-max max-w-[90%] ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          } ${toast.type === "success" ? "bg-emerald-900/90 text-white" : "bg-red-900/90 text-white"}`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <span className="text-[13px] font-black tracking-wide">
            {toast.message}
          </span>
        </div>
      </div>
    </div>
  );
}

/* KOMPONEN HELPER COLLAPSIBLE (ACCORDION) */
const CollapsibleSection = ({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const accessibilityProps = {
    "aria-expanded": isOpen,
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        {...accessibilityProps}
        className="w-full flex items-center justify-between p-6 bg-white active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            {icon}
          </div>
          <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div
          className={`text-gray-400 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Konten dengan animasi buka/tutup yang smooth */}
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100 pb-6 px-6" : "max-h-0 opacity-0 px-6 overflow-hidden"}`}
      >
        <div className="space-y-5 pt-2 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
};

const InputGroup = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: any) => (
  <div>
    <label htmlFor={name} className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-4 py-3.5 text-[13px] font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium focus:bg-indigo-50/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none shadow-sm"
    />
  </div>
);

const SelectGroup = ({ label, name, value, onChange, children }: any) => (
  <div>
    <label htmlFor={name} className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-4 py-3.5 text-[13px] font-bold text-gray-800 focus:bg-indigo-50/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none appearance-none shadow-sm"
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-indigo-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);