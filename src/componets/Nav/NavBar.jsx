import React, { useState } from 'react';
import './NavBar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { IonIcon } from '@ionic/react';
import { personOutline, menuOutline, closeOutline } from 'ionicons/icons';
import { useAuth } from '../../hooks/useAuth';


const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';
  if (isAuthPage) return null;

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile'); // Redirigir al perfil si el usuario está autenticado
    } else {
      navigate('/login'); // Redirigir a login si no está autenticado
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo a la izquierda */}
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" width="45" height="45" />
        </div>

        {/* Menú de navegación */}
        <div className={`nav-link-container ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" onClick={toggleMobileMenu}>Home</Link>
          <Link className={`nav-link ${location.pathname === '/deposits' ? 'active' : ''}`} to="/deposits" onClick={toggleMobileMenu}>Deposits</Link>
          <Link className={`nav-link ${location.pathname === '/expenses' ? 'active' : ''}`} to="/expenses" onClick={toggleMobileMenu}>Expenses</Link>

          {/* Botón de perfil y logout a la derecha */}
          <div className="auth-buttons">
            <button 
              className={`nav-link nav-link.active ${isMobileMenuOpen ? 'open' : ''} profile-btn`} 
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              <IonIcon icon={personOutline} className="user-icon" />
            </button>

            {!user ? (
              <Link className="nav-link login-btn" to="/login" onClick={toggleMobileMenu}>Login</Link>
            ) : (
              <button className="nav-link logout-btn" onClick={() => { logout(); toggleMobileMenu(); }}>Logout</button>
            )}
          </div>
        </div>

        {/* Icono de menú móvil */}
        <div className="menu-icon" onClick={toggleMobileMenu}>
          <IonIcon icon={isMobileMenuOpen ? closeOutline : menuOutline} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
