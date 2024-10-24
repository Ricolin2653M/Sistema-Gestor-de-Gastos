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
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
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
          <Button type="primary" htmlType="submit" className="login-button">
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
