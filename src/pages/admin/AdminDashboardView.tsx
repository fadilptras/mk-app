import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardView() {
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Menambahkan email ke tabel users dengan status 'belum_aktif'
        const { error } = await supabase
        .from('users')
        .insert([
            { 
            email: newEmail, 
            role: 'penghuni', 
            status_akun: 'belum_aktif',
            is_profile_complete: false
            }
        ]);

        if (error) {
        alert('Gagal menambah penghuni: ' + error.message);
        } else {
        alert('Berhasil! Arahkan penghuni untuk aktivasi menggunakan email: ' + newEmail);
        setNewEmail(''); // Kosongkan input
        }
        setLoading(false);
    };

    return (
        <div className="p-6 pb-20">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-2xl font-black text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-500 font-medium">Manajemen Mutiara Kost</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            AD
            </div>
        </div>

        {/* Card Form Tambah Penghuni */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">Mendaftarkan Penghuni Baru</h2>
            <form onSubmit={handleAddTenant} className="flex gap-2">
            <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@penghuni.com" 
                className="flex-1 h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                required
            />
            <button 
                type="submit" 
                disabled={loading}
                className="h-12 px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
                {loading ? '...' : 'Tambah'}
            </button>
            </form>
        </div>

        {/* Tempat untuk Daftar Penghuni Aktif nantinya */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">Daftar Penghuni</h2>
            <p className="text-sm text-gray-500 italic">Belum ada data untuk ditampilkan.</p>
        </div>
        </div>
    );
    }