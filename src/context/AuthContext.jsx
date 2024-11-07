import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageController } from '../services/token.service';
import { usersService } from '../services/users.service';
import { tokenExpired } from '../utils/tokenExpired';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const { children } = props;
    // Crear el estado del usuario
    const [user, setUser] = useState(null);
    // Crear el estado de carga
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        getSession();
    }, []);

    const getSession = async () => {
        const token = await storageController.getToken();
        
        // Imprime el token en la consola
        console.log("Token:", token);

        if (!token) {
            logout();
            setLoading(false);
            return;
        } 

        if (tokenExpired(token)) {
            logout();
        } else {
            login(token);
        }
    }

    const login = async (token) => {
        try {
            await storageController.setToken(token);
            const response = await usersService.getMe(token);
            setUser(response);
            setLoading(false);
            console.log("Token de login auth:", token);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            await storageController.removeToken();
            setUser(null);
            setLoading(false);
            // Redirigir usando navigate en lugar de window.location.replace
            navigate('/');
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }
    
    const updateUser = async (userData) => {
        try {
            const token = await storageController.getToken();
            if (!token) return;
            const updatedUser = await usersService.updateMe(token, userData);
            if (updatedUser) {
                setUser(updatedUser);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Update user error:', error);
        }
    };

    const data = {
        user,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
