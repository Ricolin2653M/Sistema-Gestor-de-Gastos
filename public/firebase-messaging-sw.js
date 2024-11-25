importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyAlYPiq6wZE-FLWiY5AW3FzveV09XdTtgA",
    authDomain: "push-notifications-sgp.firebaseapp.com",
    projectId: "push-notifications-sgp",
    storageBucket: "push-notifications-sgp.firebasestorage.app",
    messagingSenderId: "400829433362",
    appId: "1:400829433362:web:3a2e6072045f911b4efacb",
    measurementId: "G-ZVFN3T9RTP"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Mensaje en segundo plano:', payload);
    const { title, body, icon } = payload.notification;
    self.registration.showNotification(title, { body, icon });
});
