export default function ForgotPasswordView({ onBack }: any) {
  const WA_NUMBER = '6281289922400'; 
  const WA_MESSAGE = encodeURIComponent('Halo admin, saya ingin reset password akun kost saya. Nama saya: ... Nomor kamar: ...');

  return (
    <div>
      {/* Tombol Back - Posisi Fixed di Pojok Kiri Atas & Ditambah aria-label untuk fix error */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Kembali"
        title="Kembali"
        className="fixed top-6 left-6 z-50 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-md border border-blue-100 rounded-full shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 className="text-xl font-bold text-[#0D2F5C] mb-1">Reset Password</h2>
      <p className="text-sm text-[#7A93B5] mb-5">Ikuti langkah di bawah ini untuk reset password kamu</p>

      {/* Warning box */}
      <div className="flex gap-3 bg-[#FFF5EE] border-[1.5px] border-[#F5C4A0] rounded-xl p-3.5 mb-6">
        <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L17 16H1L9 1Z" stroke="#C47A30" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 7V10" stroke="#C47A30" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="13" r="0.8" fill="#C47A30" />
        </svg>
        <p className="text-xs text-[#A05520] leading-relaxed">
          Hubungi Admin Kost via WhatsApp untuk mendapatkan password sementara yang baru.
        </p>
      </div>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1DAA59] text-white py-3.5 rounded-2xl text-sm font-bold transition-all no-underline shadow-lg shadow-green-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.318.198-.567v-.03c0-.25-.049-.395-.198-.567-.148-.173-.312-.387-.446-.52-.148-.148-.303-.309-.13-.606.173-.298.77-1.271 1.653-2.06.1135-1.012 2.093-1.325 2.39-1.474.297-.149.471-.124.644.074.173.198.743.867.94 1.165.199.298.397.347.67.15.272-.1.688-.25 1.155-.503z" />
          <path d="M12 2.004c-5.523 0-10 4.477-10 10 0 1.954.558 3.784 1.528 5.334l-1.505 5.485 5.612-1.473c1.474.882 3.194 1.396 5.02 1.396 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zM12 20.32c-1.597 0-3.08-.415-4.348-1.144l-.312-.178-3.32.871.888-3.238-.204-.324C3.896 14.86 3.4 13.483 3.4 12c0-4.743 3.86-8.604 8.6-8.604 4.744 0 8.605 3.861 8.605 8.604 0 4.743-3.861 8.604-8.605 8.604z" />
        </svg>
        Hubungi Admin
      </a>
    </div>
  );
}