import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

// 1. Definisikan props yang diterima dari AuthPage
interface LoginViewProps {
  onForgot: () => void;
  onNewPenghuni: () => void;
  onLogin?: (email: string, pass: string) => void; // Opsional jika kamu pakai fungsi login dari luar
}

// 2. Tangkap props di dalam komponen
export default function LoginView({
  onForgot,
  onNewPenghuni,
  onLogin,
}: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk lihat password ditambahkan di sini

  // Jika kamu tetap mau pakai useAuth hook yang kita buat:
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Jika ada props onLogin dari AuthPage, gunakan itu.
    // Jika tidak, gunakan dari useAuth.
    if (onLogin) {
      await onLogin(email, password);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Masuk ke Akun
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all font-medium bg-gray-50"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            {/* 3. Pasang onClick={onForgot} di sini */}
            <button
              type="button"
              className="text-sm font-bold text-blue-600 hover:underline"
              onClick={onForgot}
            >
              Lupa?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all font-medium bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
              aria-label="Lihat Password"
            >
              {showPassword ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 mt-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
        >
          {loading ? "Memverifikasi..." : "Masuk"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-gray-500">
          Penghuni baru? {/* 4. Pasang onClick={onNewPenghuni} di sini */}
          <button
            type="button"
            onClick={onNewPenghuni}
            className="text-blue-600 font-bold hover:underline"
          >
            Aktivasi di sini
          </button>
        </p>
      </div>
    </div>
  );
}
