import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/auth.service.js';
import "./login.css";

//Imports firebase
import { getAuth, signInAnonymously } from 'firebase/auth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setLoginError(false);
    try {
      const response = await authService.loginF(values.username, values.password);
      if (response && response.data) {
        localStorage.setItem('token', response.data.token);
        login(response.data.token);
        signInAnonymously(getAuth()).then((usuario) => console.log(usuario))
        navigate('/');
      } else {
        console.error('Error en el inicio de sesión: Respuesta inesperada');
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response ? error.response.data : error.message);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
    setLoginError(true);
  };

  const handleRegistro = () => {
    navigate('/register'); 
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="icon-container">
          <img src="./../src/assets/img/finance3.png" alt="Icono o imagen" className="icon" />
          <p className="icon-text">Gestiona tus gastos fácilmente</p>
        </div>
      </div>

      <div className="login-right">
        <h1>Bienvenido</h1>
        <p className="login-description">Accede a tu cuenta para gestionar tus gastos de forma fácil y rápida.</p>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            label="Correo electrónico"
            name="username"
            rules={[{ required: true, message: "Por favor ingresa tu usuario!" }]}
          >
            <Input placeholder="Ingresa tu usuario" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Por favor ingresa tu contraseña!" }]}
          >
            <Input.Password placeholder="Ingresa tu contraseña" />
          </Form.Item>

          <Form.Item>
            {loginError && <p style={{ color: 'red' }}>Credenciales incorrectas. Inténtalo de nuevo.</p>}
            <Button type="primary" htmlType="submit" className="login-button" loading={loading}>
              Iniciar Sesión
            </Button>
          </Form.Item>

          <p className="register-link">
            ¿No tienes cuenta? <a onClick={handleRegistro}>Regístrate aquí</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
