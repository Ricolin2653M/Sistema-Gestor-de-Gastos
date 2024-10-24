import React from 'react';
import { useRoutes } from 'react-router-dom';

import Home from '../pages/home';
import Login from '../pages/login';
import Deposits from '../pages/deposits';
import Register from '../pages/register';
import Expenses from '../pages/expenses';

const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/deposits', element: <Deposits /> },
        { path: '/expenses', element: <Expenses /> },
    ]);
    return routes;
};

export default AppRoutes