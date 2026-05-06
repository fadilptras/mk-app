export default function ForgotPasswordView({ onBack }: any) {
  const WA_NUMBER = '628XXXXXXXXX'; // Ganti dengan nomor WhatsApp admin
  const WA_MESSAGE = encodeURIComponent('Halo admin, saya ingin reset password akun kost saya. Nama saya: ... Nomor kamar: ...');

  return (
    <div>
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
          Password hanya bisa direset melalui konfirmasi admin kost untuk keamanan akun penghuni.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-7">
        {[
          { n: 1, active: true,  title: 'Hubungi Admin via WhatsApp',   sub: 'Beritahu nama & nomor kamar kamu' },
          { n: 2, active: false, title: 'Admin aktifkan reset password', sub: 'Tunggu konfirmasi dari admin' },
          { n: 3, active: false, title: 'Kembali & buat password baru',  sub: 'Login dengan email lalu setel password baru' },
        ].map(({ n, active, title, sub }) => (
          <div key={n} className="flex items-start gap-3.5">
            <div
              className={`w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                active ? 'bg-[#1A5FA8] text-white' : 'bg-[#E8F1FB] text-[#8EB4D8]'
              }`}
            >
              {n}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A2E4A]">{title}</p>
              <p className="text-xs text-[#7A93B5] mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1DAA59] text-white py-3.5 rounded-2xl text-sm font-bold transition-colors no-underline"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.12 1.528 5.854L0 24l6.337-1.517A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.042-1.388l-.362-.215-3.752.899.934-3.651-.236-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
        Chat Admin via WhatsApp
      </a>

      <button
        onClick={onBack}
        className="block w-full text-center text-sm text-[#1A5FA8] font-medium mt-4 cursor-pointer bg-transparent border-0 hover:text-[#154D8A] transition-colors"
      >
        ← Kembali ke Login
      </button>
    </div>
  );
}
