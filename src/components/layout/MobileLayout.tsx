import React from 'react';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    return (
        // Background luar untuk area desktop (bisa disesuaikan warnanya nanti)
        <div className="min-h-screen bg-slate-100 flex justify-center items-center font-sans">
        
        {/* Container Aplikasi Utama:
            - max-w-md: Lebar maksimal sekitar 448px (ukuran ideal mobile)
            - sm:h-[95vh] sm:rounded-[2.5rem]: Memberikan efek seperti bentuk HP beneran jika dibuka di desktop
            - shadow-2xl: Memberi efek melayang dari background luar
        */}
        <div className="w-full max-w-md min-h-screen sm:min-h-[95vh] sm:rounded-[2.5rem] bg-white shadow-2xl sm:border-[8px] sm:border-slate-800 relative flex flex-col overflow-hidden">
            
            {/* Area Konten yang bisa di-scroll */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 no-scrollbar relative">
            {children}
            </main>

            {/* Tempat untuk Bottom Navigation Bar nantinya.
            Kita siapkan tempatnya di bawah agar alurnya jelas.
            */}
            {/* <BottomNavigation /> */}
            
        </div>
        </div>
    );
}