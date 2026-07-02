import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAYzFR81ioQAzv3l2qiRjaGKRx2fWGG12k",
    authDomain: "mk-app-a1c10.firebaseapp.com",
    projectId: "mk-app-a1c10",
    storageBucket: "mk-app-a1c10.firebasestorage.app",
    messagingSenderId: "607527820565",
    appId: "1:607527820565:web:be2cf2707527d8ca5d5d1c"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Menangkap Service Worker dari Vite PWA yang sedang berjalan
            const registration = await navigator.serviceWorker.ready;
            
            // Memberikan registration tersebut ke Firebase
            const token = await getToken(messaging, { 
                vapidKey: 'BPCykFDClfS2nouVAv0WyqmQXXxM7byOEm_rnJ4lec8ENs2oXtO1ffcpKBoxM21rkKoNwYihCgbMJA08mF6VHM8',
                serviceWorkerRegistration: registration // <--- TAMBAHAN WAJIB DI SINI
            });
            
            return token;
        }
        return null;
    } catch (error) {
        console.error('Gagal mendapat izin notifikasi:', error);
        return null;
    }
};