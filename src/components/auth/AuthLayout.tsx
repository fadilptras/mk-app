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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-xl bg-white">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-blue-700 to-blue-500 text-white text-center p-6">
            <div className="text-4xl mb-2">{icon}</div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm opacity-90">{subtitle}</p>
        </div>

        {/* CONTENT */}
        <div className="p-6">{children}</div>
        </div>
    </div>
    );
}