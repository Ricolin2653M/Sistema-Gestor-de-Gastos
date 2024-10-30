import React from "react";
import { Form, Input, Button } from "antd";
import "./Login.css";

const Login = () => {
  const onFinish = (values) => {
    console.log("Login success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
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
            label="Usuario"
            name="username"
            //rules={[{ required: true, message: "Por favor ingresa tu usuario!" }]}
          >
            <Input placeholder="Ingresa tu usuario" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            //rules={[{ required: true, message: "Por favor ingresa tu contraseña!" }]}
          >
            <Input.Password placeholder="Ingresa tu contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Iniciar Sesión
            </Button>
          </Form.Item>

          <p className="register-link">
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
