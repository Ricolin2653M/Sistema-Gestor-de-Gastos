import React, { useState } from 'react';
import authService from '../../services/auth.service'
import { Button, Input, Form, message } from 'antd'; // Usamos Ant Design para los elementos de formulario
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
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llamada al servicio de registro
      const response = await authService.register(formData.name, formData.lastname, formData.email, formData.password);

      message.success(response.message || 'Usuario registrado con éxito');
      
      setFormData({
        name: '',
        lastname: '',
        email: '',
        password: ''
      });
      navigate('/login');
    } catch (error) {
      message.error('Error al registrar el usuario. Intenta nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2 className="register-form-header">Registrarse</h2>
        <div className="register-social-networks">
        </div>
        

        <Form onSubmitCapture={handleSubmit}>
          <Form.Item label="Nombre" required={false}>
            <Input
              type="text"
              placeholder="Ingrese su nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Apellido" required={false}>
            <Input
              type="text"
              placeholder="Ingrese su apellido"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Correo Electrónico" required={false}>
            <Input
              type="email"
              placeholder="Ingrese su correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Contraseña" required={false}>
            <div style={{ position: 'relative' }}>
             
              <Input.Password
                placeholder="Ingrese su contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                iconRender={(visible) =>
                  visible ? <IonIcon icon={eyeOutline} onClick={togglePasswordVisibility} /> : <IonIcon icon={eyeOffOutline} onClick={togglePasswordVisibility} />
                }
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="register-button"
            >
              Registrarse
            </Button>
          </Form.Item>
        </Form>

        <p className="register-form-text" style={{ textAlign: 'right' }}>
          ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
