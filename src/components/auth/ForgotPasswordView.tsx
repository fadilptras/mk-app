export default function ForgotPasswordView({ onBack }: any) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">
        Reset Password
      </h2>
      <p className="text-gray-500 mb-4">
        Ikuti langkah berikut untuk reset password
      </p>

      {/* WARNING */}
      <div className="bg-orange-100 text-orange-700 p-3 rounded-xl mb-4 text-sm">
        Password hanya bisa direset melalui konfirmasi admin kost.
      </div>

      {/* STEPS */}
      <div className="space-y-4 mb-5">
        <div>
          <b>1. Hubungi Admin</b>
          <p className="text-gray-500 text-sm">
            Kirim nama & nomor kamar
          </p>
        </div>

        <div>
          <b>2. Tunggu Aktivasi</b>
          <p className="text-gray-500 text-sm">
            Admin akan mengaktifkan reset
          </p>
        </div>

        <div>
          <b>3. Set Password Baru</b>
          <p className="text-gray-500 text-sm">
            Login kembali untuk ubah password
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold mb-3">
        Chat Admin via WhatsApp
      </button>

      <button
        onClick={onBack}
        className="text-blue-600 text-sm w-full text-center"
      >
        ← Kembali ke Login
      </button>
    </>
  );
}