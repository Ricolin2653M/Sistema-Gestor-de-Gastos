import axios from 'axios';
import { ENV } from '../utils/constants';

const register = async (name, lastname, email, password) => {
    return axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.REGISTER}`, {
        name,
        lastname,
        email,
        password,
    });
};

//https://lizard-server.vercel.app/api/auth/signup

const loginF = async (email, password) => {
    return axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.LOGIN}`, {
        email,
        password,
    });
};

export default{
    register,
    loginF,
};