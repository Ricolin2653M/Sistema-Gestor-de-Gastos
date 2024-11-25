// Registrar el Service Worker principal
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
            console.log('Service Worker registrado:', registration);

            // Inicializar Firebase Messaging
            import('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js').then(({ initializeApp }) => {
                import('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js').then(({ getMessaging, getToken, onMessage }) => {
                    const firebaseConfig = {
                        apiKey: "AIzaSyAlYPiq6wZE-FLWiY5AW3FzveV09XdTtgA",
                        authDomain: "push-notifications-sgp.firebaseapp.com",
                        projectId: "push-notifications-sgp",
                        storageBucket: "push-notifications-sgp.firebasestorage.app",
                        messagingSenderId: "400829433362",
                        appId: "1:400829433362:web:3a2e6072045f911b4efacb",
                        measurementId: "G-ZVFN3T9RTP",
                    };

                    // Inicializar Firebase
                    const app = initializeApp(firebaseConfig);
                    const messaging = getMessaging(app);

                    // Solicitar permiso de notificación
                    Notification.requestPermission()
                        .then((permission) => {
                            if (permission === 'granted') {
                                console.log('Permiso de notificación otorgado');

                                // Obtener el token de FCM
                                getToken(messaging, { vapidKey: 'BFm1JIsWvokI9-0Y1HAX9QxPH0Vmvcph9U5jGYZkq2OMDc8S8sHrNAqGzTfxNL8D4KTETCIw39F9t7po-f9AoLM' })
                                    .then((currentToken) => {
                                        if (currentToken) {
                                            console.log('Token de notificación FCM:', currentToken);
                                            // Enviar el token al backend o usarlo según tu lógica
                                        } else {
                                            console.warn('No se obtuvo un token.');
                                        }
                                    })
                                    .catch((err) => console.error('Error al obtener el token de FCM:', err));
                            } else {
                                console.warn('Permiso de notificación denegado.');
                            }
                        });

                    // Manejar mensajes en primer plano
                    onMessage(messaging, (payload) => {
                        console.log('Mensaje recibido en primer plano:', payload);
                        const { title, body, icon } = payload.notification;
                        new Notification(title, { body, icon });
                    });
                });
            });
        })
        .catch((error) => console.error('Error al registrar el Service Worker:', error));
}
