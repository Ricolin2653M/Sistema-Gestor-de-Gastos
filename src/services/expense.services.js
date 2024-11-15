import { authFetch } from "../utils/authFetch";
import { ENV } from "../utils/constants";

// Función para crear un nuevo gasto
const createExpense = async (token, paymentData) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PAYMENT}`;
        const response = await authFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            throw new Error('Error al crear el gasto');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función createDeposit:', error);
        throw error;
    }
};

// Función para obtener todos los gastos de un usuario
const getExpenses = async (token, idUser) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PAYMENT}/${idUser}`;
        const response = await authFetch(url, {
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los gastos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función getExpenses:', error);
        throw error;
    }
};

// Función para actualizar un depósito específico
const updateExpense = async (token, id, idUser, paymentData) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PAYMENT}/${idUser}/${id}`;
        const response = await authFetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el gasto');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función updateExpense:', error);
        throw error;
    }
};

// Función para eliminar un depósito específico
const deleteExpense = async (token, id, idUser) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PAYMENT}/${idUser}/${id}`;
        const response = await authFetch(url, {
            method: 'DELETE',
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el gasto');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en función deleteExpense:', error);
        throw error;
    }
};

// Exportar el servicio de depósitos
export const expenseService = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};
