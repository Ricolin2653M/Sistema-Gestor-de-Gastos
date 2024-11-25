import { jwtDecode } from "jwt-decode";
import { ENV } from "../utils/constants";
import { authFetch } from "../utils/authFetch";

// Función para obtener usuarios
const users = async (token) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}`;
        const response = token ? await authFetch(url, { headers: { 'x-access-token': token } }) : await fetch(url); // Usar authFetch solo si hay token
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en función de usuarios:', error);
        throw new Error('Error al obtener los usuarios');
    }
};

const getMe = async (token) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Token inválido');
        }
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
        const response = await authFetch(url, { headers: { 'x-access-token': token } });

        if (!response.ok) {
            throw new Error('Error al obtener el usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función getMe:', error);
        throw new Error('Error al obtener el usuario');
    }
};


// Función para actualizar el usuario actual
const updateMe = async (token, userData) => {
    try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
        const response = await authFetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token // Agregar el token en los headers
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw new Error('Error al actualizar el usuario');
    }
};

// Función para eliminar un usuario
const deleteUser = async (token, id_user) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${id_user}`;
        const response = await authFetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token // Agregar el token en los headers
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw new Error('Error al eliminar el usuario');
    }
};

// Función para actualizar un usuario
const updateUser = async (token, userId, userData) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
        const response = await authFetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw new Error('Error al actualizar el usuario');
    }
};

// Exportar el servicio de usuarios
export const usersService = {
    getMe,
    updateMe,
    users,
    deleteUser,
    updateUser
};
