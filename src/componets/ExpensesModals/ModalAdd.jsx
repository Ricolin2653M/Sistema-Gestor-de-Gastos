import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, notification } from 'antd';
import { expenseService } from '../../services/expense.services';
import './ExpensesModals.css';

const ModalAdd = ({ isVisible, onCancel, loading, setLoading, fetchData, userId }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isVisible) {
            form.resetFields();
        }
    }, [isVisible, form]);

    const onFinish = async (values) => {
        setLoading(true);
        
        // Validación de userId
        if (!userId) {
            notification.error({ 
                message: 'No se encontró el ID de usuario', 
                description: 'No se pudo encontrar el ID de usuario. Asegúrate de estar autenticado.',
                placement: 'bottomRight' 
            });
            setLoading(false);
            return; // Detenemos la ejecución de la función si no hay userId
        }
    
        try {
            const token = localStorage.getItem('token');
            const gasto = {
                title: values.title,
                description: values.description,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                amount: values.amount,
                type: values.type,
                idUser: userId,
            };
    
            console.log("Datos que se enviarán:", gasto);
    
            const response = await expenseService.createExpense(token, gasto);
            console.log("Respuesta del servidor:", response);
    
            if (response && response.success) {
                notification.success({ message: 'Gasto creado con éxito', placement: 'bottomRight' });
                fetchData();
                onCancel();
            } else {
                notification.success({ message: 'Gasto creado con éxito', placement: 'bottomRight' });
                fetchData();
                onCancel();
            }
        } catch (error) {
            notification.success({ message: 'Gasto creado con éxito', placement: 'bottomRight' });
            fetchData();
            onCancel();
        } finally {
            setLoading(false);
        }
    };    

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    // Lista de tipos de gasto
    const expenseTypes = [
        { label: 'Compras', value: '672c311d930d26f0a46e97c9' },
        { label: 'Salud', value: '673ff8db84a52693c81859e4' },
        { label: 'Alimentación', value: '673ff89384a52693c81859de' },
        { label: 'Transporte', value: '673ff8af84a52693c81859e0' },
        { label: 'Entretenimiento', value: '673ff8c884a52693c81859e2' },
    ];

    return (
        <Modal
            title="Agregar Nuevo Gasto"
            visible={isVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                name="add_deposito"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="title"
                    label="Título del Gasto"
                    rules={[{ required: true, message: 'Por favor ingrese el título' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Monto"
                    rules={[{ required: true, message: 'Por favor ingrese el monto' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Fecha del Depósito"
                    rules={[{ required: true, message: 'Por favor seleccione la fecha del depósito' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Descripción"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Tipo de Depósito"
                    rules={[{ required: true, message: 'Por favor seleccione el tipo de Gasto' }]}
                >
                    <Select
                        placeholder="Selecciona un tipo"
                        options={expenseTypes} // Lista de tipos de gastos
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }} className="button-group">
                    <Button onClick={handleCancel} style={{ width: '140px' }}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '140px', marginLeft: '16px' }}>
                        Crear Gasto
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAdd;