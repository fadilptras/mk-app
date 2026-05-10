import React from 'react';

export default function PenghuniDashboardView() {
    return (
        <div className="p-6 pb-20 bg-slate-50 min-h-full">
        {/* Header Profile */}
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-xl">
            US
            </div>
            <div>
            <h1 className="text-xl font-bold text-gray-900">Halo, Penghuni!</h1>
            <p className="text-sm text-gray-500">Semoga harimu menyenangkan</p>
            </div>
        </div>

        {/* Card Info Kamar (Placeholder) */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl mb-6">
            <p className="text-blue-200 text-sm font-medium mb-1">Status Kamar</p>
            <h2 className="text-3xl font-black mb-4">Kamar A-01</h2>
            <div className="flex justify-between items-end">
            <div>
                <p className="text-xs text-blue-200">Tagihan Bulan Ini</p>
                <p className="text-lg font-bold">Rp 1.500.000</p>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-50 transition-colors">
                Bayar
            </button>
            </div>
        </div>
        </div>
    );
    }