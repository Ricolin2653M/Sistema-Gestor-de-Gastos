import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Importa el logo aquí
import { IonIcon } from '@ionic/react';
import { personOutline } from 'ionicons/icons'; // Importa el ícono de usuario
import { useAuth } from '../../hooks/useAuth'; // Importa el hook que maneja la autenticación

const NavBar = () => {
  const { user, logout } = useAuth(); // Usar el hook de autenticación
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';

  // Si está en las páginas de login o registro, no mostrar la barra
  if (isAuthPage) return null;

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" width="50" height="50" /> 
      </div>
      <div className="nav-link-container">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/deposits">Depositos</Link>
        <Link className="nav-link" to="/expenses">Gastos</Link>

        {!user ? (
          <Link className="nav-link" to="/login">Login</Link>
        ) : (
          <button className="nav-link" onClick={logout}>Logout</button>
        )}
      </div>
      <div className="user-icon-container">
        <IonIcon icon={personOutline} className="user-icon" />
      </div>
    </nav>
  );
};

export default NavBar;
