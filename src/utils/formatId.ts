export type EntityType = 'kontrak' | 'tagihan' | 'laporan';

export const generateRefID = (tipe: EntityType, uuid: string, dateString?: string) => {
    if (!uuid) return '-';
    
    // 1. Tentukan Prefix berdasarkan entitas
    const prefixMap = {
        kontrak: 'KTR',
        tagihan: 'TGH',
        laporan: 'LPR'
    };
    const prefix = prefixMap[tipe];

    // 2. Ambil 6 digit pertama dari UUID dan jadikan huruf kapital
    const uniqueCode = uuid.split('-')[0].substring(0, 6).toUpperCase(); 

    // 3. Ambil Tahun (Bisa dari tanggal dibuatnya dokumen, atau fallback ke tahun saat ini)
    const d = dateString ? new Date(dateString) : new Date();
    const yyyy = d.getFullYear();

    // Hasil akhir contoh: MK/KTR/2026/44CB4E
    return `MK/${prefix}/${yyyy}/${uniqueCode}`;
};