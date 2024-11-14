import { authFetch } from "../utils/authFetch";
import { ENV } from "../utils/constants";

// Función para crear un nuevo depósito
const createDeposit = async (token, depositData) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.DEPOSIT}`;
        const response = await authFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(depositData),
        });

        if (!response.ok) {
            throw new Error('Error al crear el depósito');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función createDeposit:', error);
        throw error;
    }
};

// Función para obtener todos los depósitos de un usuario
const getDeposits = async (token, idUser) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.DEPOSIT}/${idUser}`;
        const response = await authFetch(url, {
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los depósitos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función getDeposits:', error);
        throw error;
    }
};

// Función para actualizar un depósito específico
const updateDeposit = async (token, id, idUser, depositData) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.DEPOSIT}/${id}/${idUser}`;
        const response = await authFetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(depositData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el depósito');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función updateDeposit:', error);
        throw error;
    }
};

// Función para eliminar un depósito específico
const deleteDeposit = async (token, id, idUser) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.DEPOSIT}/${id}/${idUser}`;
        const response = await authFetch(url, {
            method: 'DELETE',
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el depósito');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función deleteDeposit:', error);
        throw error;
    }
};

// Exportar el servicio de depósitos
export const depositService = {
    createDeposit,
    getDeposits,
    updateDeposit,
    deleteDeposit
};
