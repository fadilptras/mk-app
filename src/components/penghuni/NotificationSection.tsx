import { useNavigate } from 'react-router-dom';

export interface NotificationItem {
    id: string | number;
    title: string;
    time: string;
    desc: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationSectionProps {
    notifications: NotificationItem[];
}

export default function NotificationSection({ notifications }: NotificationSectionProps) {
    const navigate = useNavigate();

  // Helper untuk menentukan warna dan icon berdasarkan tipe notifikasi
    const getIconConfig = (type: string) => {
        switch (type) {
        case 'warning': // Untuk tagihan belum dibayar
            return {
            bg: 'bg-rose-100',
            color: 'text-rose-600',
            icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
            };
        case 'success': // Untuk pembayaran berhasil
            return {
            bg: 'bg-emerald-100',
            color: 'text-emerald-600',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            };
        default: // Info umum
            return {
            bg: 'bg-sky-100',
            color: 'text-sky-600',
            icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            };
        }
    };

    return (
        <div className="bg-white p-5 rounded-[28px] border border-gray-100 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
            <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">Notifikasi</h3>
            <button 
            onClick={() => navigate('/notifications')} 
            className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-indigo-100 active:scale-95 transition-all"
            >
            Semua
            </button>
        </div>
        
        <div className="space-y-3">
            {notifications.length > 0 ? (
            notifications.slice(0, 3).map((item) => {
                const config = getIconConfig(item.type);
                return (
                <div 
                    key={item.id} 
                    onClick={() => navigate('/notifications')}
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-transparent transition-all hover:bg-gray-50 hover:border-gray-100 cursor-pointer active:scale-[0.98]"
                >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
                    </svg>
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                    <div className="flex justify-between items-center mb-0.5">
                        <p className="text-[11px] font-black text-gray-800 uppercase truncate pr-2">{item.title}</p>
                        <span className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 truncate">{item.desc}</p>
                    </div>
                </div>
                );
            })
            ) : (
            <div className="text-center py-4">
                <p className="text-xs font-medium text-gray-400">Tidak ada notifikasi saat ini.</p>
            </div>
            )}
        </div>
        </div>
    );
}