export const ENV = {
    API_URL: 'https://aplicacion-sgp.vercel.app',

    // Endpoints de la API
    ENDPOINTS: {
        REGISTER: 'api/auth/signup',   // Endpoint para registro de usuario
        LOGIN: 'api/auth/signin',      // Endpoint para inicio de sesión
    },

    // Configuración para el almacenamiento (por ejemplo, token en localStorage)
    STORAGE: {
        TOKEN: 'token',  // Clave para almacenar el token en el almacenamiento local
    }
};
