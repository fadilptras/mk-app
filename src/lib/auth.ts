import { supabase } from './supabase';

export type StatusAkun = 'belum_aktif' | 'aktif' | 'reset_password' | null;

/**
 * 1. Cek status akun berdasarkan email
 */
export const checkEmailStatus = async (email: string): Promise<StatusAkun> => {
  if (!email) throw new Error('Email wajib diisi');

  const { data, error } = await supabase
    .from('users')
    .select('status_akun')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error('Terjadi kesalahan saat mengecek email');
  }

  if (!data) {
    throw new Error('Email tidak ditemukan');
  }

  return data.status_akun as StatusAkun;
};

/**
 * 2. Login user
 */
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    throw new Error('User tidak ditemukan');
  }

  // ⚠️ sementara (belum hashing)
  if (data.password !== password) {
    throw new Error('Password salah');
  }

  return data;
};

/**
 * 3. Set password baru
 */
export const setAccountPassword = async (
  email: string,
  newPassword: string
) => {
  if (!email || !newPassword) {
    throw new Error('Data tidak lengkap');
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      password: newPassword, // nanti wajib hashing
      status_akun: 'aktif',
    })
    .eq('email', email)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Gagal menyimpan password');
  }

  return data;
};