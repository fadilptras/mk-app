import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Pastikan path ini benar
import toast from 'react-hot-toast';

export interface AppNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'tagihan' | 'kontrak' | 'laporan' | 'info';
    is_read: boolean;
    created_at: string;
}

    export const useNotifications = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const requestPushPermission = async () => {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            toast.success('Notifikasi device berhasil diaktifkan!');
        }
        }
    };

    useEffect(() => {
    let channel: any;

    const initNotifications = async () => {
      setIsLoading(true);
      
      // 1. Ambil data user langsung dari Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // 2. Fetch Data Awal
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
      setIsLoading(false);

      // 3. Setup Realtime Listener (Perbaikan Nama Channel)
      const channelName = `notif_channel_${user.id}`;
      channel = supabase.channel(channelName);
      
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            const newNotif = payload.new as AppNotification;
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast(newNotif.title, { icon: '🔔' });
          }
        )
        .subscribe();
    };

    initNotifications();
    requestPushPermission();

    // Cleanup: Matikan channel khusus ini saat komponen dibongkar
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

    const markAsRead = async (id: string) => {
        const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        if (!error) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    };

    return { notifications, unreadCount, isLoading, markAsRead, requestPushPermission };
};