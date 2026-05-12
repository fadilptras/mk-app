import React from 'react';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f5f3ff] flex justify-center items-center font-sans">
            <div className="w-full max-w-md min-h-screen sm:min-h-[90vh] sm:rounded-2xl bg-white shadow-2xl relative flex flex-col overflow-hidden">
                
                <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar relative">
                    {children}
                </main>
                
            </div>
        </div>
    );
}