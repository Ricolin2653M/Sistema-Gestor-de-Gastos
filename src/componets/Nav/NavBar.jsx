import React, { useState } from 'react';
import './NavBar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import { IonIcon } from '@ionic/react';
import { menuOutline, closeOutline } from 'ionicons/icons';
import { useAuth } from '../../hooks/useAuth';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';
  if (isAuthPage) return null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="nav-navbar">
      <div className="nav-navbar-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" />
        </div>

        {/* Navigation Links */}
        <div className={`nav-link-container ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <Link
            className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}
            to="/"
            onClick={toggleMobileMenu}
          >
            Inicio
          </Link>
          <Link
            className={`nav-link ${location.pathname === '/deposits' ? 'nav-active' : ''}`}
            to="/deposits"
            onClick={toggleMobileMenu}
          >
            Depósitos
          </Link>
          <Link
            className={`nav-link ${location.pathname === '/expenses' ? 'nav-active' : ''}`}
            to="/expenses"
            onClick={toggleMobileMenu}
          >
            Gastos
          </Link>
        </div>

        {/* Logout or Login Buttons */}
        <div className="nav-auth-buttons">
          {!user ? (
            <Link className="nav-link nav-login-btn" to="/login" onClick={toggleMobileMenu}>
              Acceso
            </Link>
          ) : (
            <button
              className="nav-logout-btn"
              onClick={() => {
                logout();
                toggleMobileMenu();
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="nav-menu-icon" onClick={toggleMobileMenu}>
          <IonIcon icon={isMobileMenuOpen ? closeOutline : menuOutline} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
