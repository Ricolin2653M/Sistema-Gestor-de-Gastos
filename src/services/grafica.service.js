import { authFetch } from "../utils/authFetch";
import { ENV } from "../utils/constants";



// Función para obtener todos los gastos de un usuario
const getExpenses = async (token, idUser) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GRAFICA}/${idUser}/expenses`;
        const response = await authFetch(url, {
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los gastos para la gráfica');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en función getExpenses:', error);
        throw error;
    }
};

// Función para obtener todos los depósitos de un usuario
const getDeposits = async (token, idUser) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GRAFICA}/${idUser}/deposits`;
        const response = await authFetch(url, {
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los depósitos para la gráfica');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en función getDeposits:', error);
        throw error;
    }
};






// Exportar el servicio de depósitos
export const graficaService = {
    getExpenses,
    getDeposits
};
