import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  view: 'login' | 'forgot-password' | 'new-tenant';
  onBack?: () => void;
}

export default function AuthLayout({ children, view, onBack }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#EBF3FD] flex flex-col sm:items-center sm:justify-center">
      <div className="w-full sm:max-w-[420px] sm:my-6 flex-1 sm:flex-none">
        <div className="bg-white sm:rounded-3xl overflow-hidden sm:shadow-[0_8px_40px_rgba(26,95,168,0.12)] sm:border sm:border-[#C5DAFA]/50 flex flex-col min-h-screen sm:min-h-0">

          {/* Blue Header */}
          <div
            className="relative overflow-hidden px-6 sm:px-7 pt-6 sm:pt-8 pb-10 sm:pb-14 flex-shrink-0"
            style={{ background: 'linear-gradient(160deg, #1A5FA8 0%, #0D3F7A 100%)' }}
          >
            <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-white/[0.06] pointer-events-none" />
            <div className="absolute -bottom-8 left-4 w-28 h-28 rounded-full bg-white/[0.04] pointer-events-none" />

            {onBack && (
              <button
                onClick={onBack}
                className="relative z-10 flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium mb-4 transition-colors bg-transparent border-0 cursor-pointer p-0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Kembali
              </button>
            )}

            <div className="relative z-10 flex flex-col items-center text-center">
              {view === 'login' && (
                <>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[18px] bg-white/[0.15] border border-white/25 flex items-center justify-center mb-2.5 sm:mb-3">
                    <svg width="26" height="26" className="sm:w-[34px] sm:h-[34px]" viewBox="0 0 32 32" fill="none">
                      <path d="M6 28V14L16 6L26 14V28H19V21H13V28H6Z" fill="white" opacity="0.9" />
                      <rect x="13" y="21" width="6" height="7" rx="1" fill="rgba(255,255,255,0.45)" />
                    </svg>
                  </div>
                  <h1 className="text-lg sm:text-[22px] font-bold text-white tracking-tight">Mutiara Kost</h1>
                  <p className="text-[11px] text-white/65 mt-0.5">Manajemen kost modern &amp; mudah</p>
                </>
              )}

              {view === 'forgot-password' && (
                <>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/[0.15] border border-white/25 flex items-center justify-center mb-2.5 sm:mb-3">
                    <svg width="26" height="26" className="sm:w-[34px] sm:h-[34px]" viewBox="0 0 32 32" fill="none">
                      <rect x="6" y="14" width="20" height="14" rx="3" stroke="white" strokeWidth="1.8" />
                      <path d="M10 14V10C10 7.79 11.79 6 14 6H18C20.21 6 22 7.79 22 10V14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="16" cy="20" r="2" fill="white" />
                      <path d="M16 22V24" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-white/75 max-w-[180px] leading-relaxed">Reset password dibantu oleh admin kost</p>
                </>
              )}

              {view === 'new-tenant' && (
                <>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[18px] bg-white/[0.15] border border-white/25 flex items-center justify-center mb-2.5 sm:mb-3">
                    <svg width="26" height="26" className="sm:w-[34px] sm:h-[34px]" viewBox="0 0 32 32" fill="none">
                      <circle cx="14" cy="11" r="5" stroke="white" strokeWidth="1.8" />
                      <path d="M4 26C4 22 8.5 19 14 19C19.5 19 24 22 24 26" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="24" cy="9" r="4" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
                      <path d="M24 7V11M22 9H26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Aktivasi Akun</h1>
                  <p className="text-[11px] text-white/65 mt-0.5">Penghuni baru Mutiara Kost</p>
                </>
              )}
            </div>
          </div>

          {/* Form body */}
          <div className="-mt-5 sm:-mt-6 bg-white rounded-t-3xl sm:rounded-3xl relative z-10 px-5 sm:px-7 pt-6 sm:pt-7 pb-8 sm:pb-9 flex-1 sm:flex-none">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}