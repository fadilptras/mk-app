import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/auth/useLogin";
import AuthLayout from "../../components/auth/AuthLayout";
import { Toaster } from "react-hot-toast";

export default function LoginView() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <AuthLayout>
            <div className="w-full">
                <Toaster position="top-center" />
                <h2 className="text-xl font-extrabold text-[#1E293B] mb-6 text-center uppercase tracking-wide">
                    Login Penghuni
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="text-[11px] font-black text-[#475569] block mb-2 uppercase tracking-widest">
                            Email Terdaftar
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@mutiarakost.com"
                            className="w-full h-[52px] px-5 rounded-2xl border border-white/60 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all font-semibold bg-white/50 text-sm text-gray-800 shadow-inner"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[11px] font-black text-[#475569] uppercase tracking-widest">Password</label>
                            <button
                                type="button"
                                className="text-[11px] font-bold text-fuchsia-600 hover:text-fuchsia-700 uppercase tracking-wider"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Lupa Sandi?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-[52px] px-5 pr-12 rounded-2xl border border-white/60 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all font-semibold bg-white/50 text-sm text-gray-800 tracking-wider shadow-inner"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors focus:outline-none"
                                aria-label="Lihat Password"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-[52px] mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black rounded-2xl shadow-[0_8px_20px_0_rgba(34,211,238,0.3)] transition-all active:scale-95 text-[13px] uppercase tracking-widest ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}