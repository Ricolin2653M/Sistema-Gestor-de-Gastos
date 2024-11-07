export const ENV = {
    API_URL: 'http://localhost:3000',

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
