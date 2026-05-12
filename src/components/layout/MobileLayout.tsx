import React from 'react';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center font-sans">
        <div className="w-full max-w-md min-h-screen sm:min-h-[95vh] sm:rounded-[2.5rem] bg-white shadow-2xl sm:border-[8px] sm:border-slate-800 relative flex flex-col overflow-hidden">
            
            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 no-scrollbar relative bg-white">
            {children}
            </main>
            
        </div>
        </div>
    );
}