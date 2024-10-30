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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <form className="sign-up" onSubmit={handleSubmit}>
          <h2 className="register-form-header">Registrarse</h2>
          <div className="register-social-networks">
            <IonIcon icon={logoInstagram} />
            <IonIcon icon={logoTiktok} />
          </div>
          <span className="register-form-text">Use su correo electrónico para registrarse</span>
          <div className="register-input-container">
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
          <div className="register-input-container">
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
          <div className="register-input-container" style={{ position: 'relative' }}>
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
          <button className="register-button" type="submit">REGISTRARSE</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
