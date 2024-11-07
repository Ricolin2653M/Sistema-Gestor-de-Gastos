import axios from 'axios';
import { ENV } from '../utils/constants';

// Función para registrar un nuevo usuario
export const register = async (name, lastname, email, password) => {
    try {
        const response = await axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.REGISTER}`, {
            name,
            lastname,
            email,
            password,
        });
        return response.data;  // Devuelve el mensaje de éxito del backend
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;  // Propaga el error para manejarlo en el componente
    }
};

// Función para iniciar sesión de un usuario
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.LOGIN}`, {
            email,
            password,
        });
        return response.data;  // Devuelve el token generado por el backend
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;  // Propaga el error para manejarlo en el componente
    }
};
