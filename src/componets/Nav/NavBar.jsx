import React from 'react';
import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Importa el logo aquí
import { IonIcon } from '@ionic/react';
import { personOutline } from 'ionicons/icons'; // Importa el ícono de usuario

const NavBar = () => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';

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
      </div>
      <div className="user-icon-container">
        <IonIcon icon={personOutline} className="user-icon" />
      </div>
    </nav>
  );
};

export default NavBar;
