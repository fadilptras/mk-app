import { useNavigate } from 'react-router-dom';
import AuthLayout from "../../components/auth/AuthLayout";

export default function ForgotPasswordView() {
    const navigate = useNavigate();
    const WA_NUMBER = '6281289922400'; 
    const WA_MESSAGE = encodeURIComponent('Halo admin, saya ingin reset password akun kost saya. Nama saya: ... Nomor kamar: ...');

    return (
        // Memanggil prop onBack untuk memunculkan tombol kembali di pojok layar
        <AuthLayout onBack={() => navigate('/login')}>
            <div className="w-full">
                
                {/* Header Section (Tengah dan Lega) */}
                <div className="w-full text-center mb-6">
                    <h2 className="text-[22px] font-extrabold text-[#1E293B] uppercase tracking-widest mb-1.5">Reset Sandi</h2>
                    <p className="text-[12px] text-[#475569] font-bold">
                        Lupa password? Ikuti petunjuk di bawah ini.
                    </p>
                </div>

                {/* Warning box yang lega dan nyaman dibaca */}
                <div className="flex gap-3.5 bg-orange-400/10 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4 mb-8 shadow-inner items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 text-orange-600 shadow-sm border border-white/50">
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <path d="M9 1L17 16H1L9 1Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                            <path d="M9 7V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
                        </svg>
                    </div>
                    <div className="flex-1 mt-0.5">
                        <p className="text-[12px] text-[#9A3412] leading-relaxed font-extrabold">
                            Hubungi Admin Kost via WhatsApp untuk mendapatkan instruksi reset password.
                        </p>
                    </div>
                </div>

                <a
                    href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white h-[52px] rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all no-underline shadow-[0_8px_20px_0_rgba(16,185,129,0.3)] active:scale-95 border border-emerald-300/50"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.318.198-.567v-.03c0-.25-.049-.395-.198-.567-.148-.173-.312-.387-.446-.52-.148-.148-.303-.309-.13-.606.173-.298.77-1.271 1.653-2.06.1135-1.012 2.093-1.325 2.39-1.474.297-.149.471-.124.644.074.173.198.743.867.94 1.165.199.298.397.347.67.15.272-.1.688-.25 1.155-.503z" />
                        <path d="M12 2.004c-5.523 0-10 4.477-10 10 0 1.954.558 3.784 1.528 5.334l-1.505 5.485 5.612-1.473c1.474.882 3.194 1.396 5.02 1.396 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zM12 20.32c-1.597 0-3.08-.415-4.348-1.144l-.312-.178-3.32.871.888-3.238-.204-.324C3.896 14.86 3.4 13.483 3.4 12c0-4.743 3.86-8.604 8.6-8.604 4.744 0 8.605 3.861 8.605 8.604 0 4.743-3.861 8.604-8.605 8.604z" />
                    </svg>
                    Hubungi Admin
                </a>
            </div>
        </AuthLayout>
    );
}