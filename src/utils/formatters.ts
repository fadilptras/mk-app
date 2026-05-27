/**
 * Format tanggal dari string ISO ke format lokal Indonesia
 * Contoh: "2026-05-27" -> "27 Mei 2026"
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Format angka menjadi nominal Rupiah
 * Contoh: 1500000 -> "Rp 1.500.000,00"
 */
export const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR' 
  }).format(amount);
};