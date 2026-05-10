import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ProfileEditView() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nik: '',
        no_whatsapp: '',
        jenis_kelamin: 'L',
        pekerjaan_instansi: '',
        darurat_nama: '',
        darurat_hp: '',
        darurat_hubungan: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
        // 1. Simpan ke tabel user_profiles
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{ ...formData, user_id: user.id }]);

        if (profileError) {
            alert(profileError.message);
            setLoading(false);
            return;
        }

        // 2. Update status is_profile_complete di tabel users
        await supabase
            .from('users')
            .update({ is_profile_complete: true })
            .eq('id', user.id);

        alert("Profil berhasil dilengkapi!");
        navigate('/dashboard');
        }
    };

    return (
        <div className="p-6 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lengkapi Profil</h1>
        <p className="text-gray-500 mb-8">Mohon isi data berikut dengan benar untuk keamanan administrasi kost.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seksi Biodata */}
            <div className="space-y-4">
            <h2 className="font-bold text-blue-600 border-b pb-2">Biodata Diri</h2>
            <input 
                type="text" placeholder="Nama Lengkap sesuai KTP"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                required
            />
            <input 
                type="text" placeholder="NIK (16 Digit)"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, nik: e.target.value})}
                required
            />
            <select 
                title="Jenis Kelamin"
                aria-label="Pilih Jenis Kelamin"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 outline-none"
                onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
            >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
            </select> 
            </div>

            {/* Seksi Kontak & Instansi */}
            <div className="space-y-4 pt-4">
            <h2 className="font-bold text-blue-600 border-b pb-2">Kontak & Instansi</h2>
            <input 
                type="tel" placeholder="Nomor WhatsApp"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})}
                required
            />
            <input 
                type="text" placeholder="Pekerjaan / Instansi (Kampus/Kantor)"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, pekerjaan_instansi: e.target.value})}
                required
            />
            </div>

            {/* Seksi Kontak Darurat */}
            <div className="space-y-4 pt-4">
            <h2 className="font-bold text-blue-600 border-b pb-2">Kontak Darurat</h2>
            <input 
                type="text" placeholder="Nama Kontak Darurat"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, darurat_nama: e.target.value})}
                required
            />
            <input 
                type="tel" placeholder="Nomor HP Darurat"
                className="w-full h-12 px-4 rounded-xl border-2 bg-gray-50 focus:border-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, darurat_hp: e.target.value})}
                required
            />
            </div>

            <button 
            type="submit" disabled={loading}
            className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl shadow-lg mt-4 disabled:opacity-50"
            >
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
        </form>
        </div>
    );
    }