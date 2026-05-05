export default function AuthLayout({
    title,
    subtitle,
    icon,
    children,
}: {
    title: string;
    subtitle: string;
    icon: string;
    children: React.ReactNode;
}) {
    return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B3B82] via-[#0D47A1] to-[#041533] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        
        {/* Dekorasi Background Tipis (opsional, memberi tekstur) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
            
            {/* HEADER BERGAYA REFERENSI */}
            <div className="flex flex-col items-center mb-10">
                <div className="text-7xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {icon}
                </div>
                <h1 className="text-2xl font-bold text-white tracking-wide uppercase drop-shadow-md">
                    {title}
                </h1>
                <p className="text-sm text-blue-200 mt-2 font-medium text-center">
                    {subtitle}
                </p>
            </div>

            {/* CONTENT BUKAN CARD LAGI, LANGSUNG DI BODY */}
            <div className="w-full">
                {children}
            </div>
            
        </div>
    </div>
    );
}