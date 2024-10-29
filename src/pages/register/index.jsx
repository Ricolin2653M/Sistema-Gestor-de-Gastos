import React, { useState } from 'react';
import './RegisterForm.css';
import { IonIcon } from '@ionic/react';
import { 
  personOutline, 
  mailOutline, 
  lockClosedOutline, 
  eyeOffOutline, 
  eyeOutline, 
  logoInstagram, 
  logoTiktok 
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Inicializa navigate con useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate('/login'); // Redirige a la pantalla de login
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="container-form">
        <form className="sign-up" onSubmit={handleSubmit}>
          <h2>Registrarse</h2>
          <div className="social-networks">
            <IonIcon icon={logoInstagram} />
            <IonIcon icon={logoTiktok} />
          </div>
          <span>Use su correo electrónico para registrarse</span>
          <div className="container-input">
            <IonIcon icon={personOutline} />
            <input
              type="text"
              placeholder="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="container-input">
            <IonIcon icon={mailOutline} />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="container-input" style={{ position: 'relative' }}>
            <IonIcon icon={lockClosedOutline} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <IonIcon 
              icon={showPassword ? eyeOutline : eyeOffOutline} 
              onClick={togglePasswordVisibility} 
              style={{ 
                position: 'absolute', 
                right: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                cursor: 'pointer' 
              }} 
            />
          </div>
          <button className="button" type="submit">REGISTRARSE</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
