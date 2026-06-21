import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";

export function useSetWifi() {
    const [wifiSettings, setWifiSettings] = useState({ ssid: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchWifi = useCallback(async () => {
        setLoading(true);
        try {
        const { data, error } = await supabase
            .from("wifi_networks")
            .select("*")
            .eq("is_active", true)
            .maybeSingle();

        if (error) throw error;
        
        if (data) {
            setWifiSettings({ ssid: data.ssid || "", password: data.password || "" });
        }
        } catch (error) {
        console.error("Gagal load WiFi:", error);
        toast.error("Gagal memuat pengaturan WiFi.");
        } finally {
        setLoading(false);
        }
    }, []);

    const updateWifiSettings = async (ssid: string, password: string) => {
        setIsUpdating(true);
        try {
        // 1. Nonaktifkan WiFi yang lama (History keeping)
        await supabase
            .from("wifi_networks")
            .update({ is_active: false })
            .eq("is_active", true);

        // 2. Tambahkan WiFi yang baru sebagai jaringan aktif
        const { error } = await supabase
            .from("wifi_networks")
            .insert([{ ssid, password, is_active: true }]);

        if (error) throw error;

        setWifiSettings({ ssid, password });
        toast.success("Kredensial WiFi kos berhasil diperbarui!");
        return true;
        } catch (error: any) {
        console.error("Update WiFi error:", error);
        toast.error(`Gagal menyimpan: ${error.message}`);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchWifi();
    }, [fetchWifi]);

    return { wifiSettings, loading, isUpdating, updateWifiSettings };
}