import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAlYPiq6wZE-FLWiY5AW3FzveV09XdTtgA",
    authDomain: "push-notifications-sgp.firebaseapp.com",
    projectId: "push-notifications-sgp",
    storageBucket: "push-notifications-sgp.firebasestorage.app",
    messagingSenderId: "400829433362",
    appId: "1:400829433362:web:3a2e6072045f911b4efacb",
    measurementId: "G-ZVFN3T9RTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);