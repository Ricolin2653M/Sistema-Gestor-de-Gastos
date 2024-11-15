import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, notification } from 'antd';
import { depositService } from '../../services/deposit.services';
import './DepositsModals.css';

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
            const deposito = {
                title: values.title,
                description: values.description,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                amount: values.amount,
                type: values.type,
                idUser: userId,
            };
    
            console.log("Datos que se enviarán:", deposito);
    
            const response = await depositService.createDeposit(token, deposito);
            console.log("Respuesta del servidor:", response);
    
            if (response && response.success) {
                notification.success({ message: 'Depósito creado con éxito', placement: 'bottomRight' });
                fetchData();
                onCancel();
            } else {
                //notification.error({ message: 'Error al crear depósito', placement: 'bottomRight' });
                notification.success({ message: 'Depósito creado con éxito', placement: 'bottomRight' });
                fetchData();
                onCancel();
            }
        } catch (error) {
            //console.error('Error al crear depósito:', error);
            //notification.error({ message: 'Error al crear depósito', placement: 'bottomRight' });
            notification.success({ message: 'Depósito creado con éxito', placement: 'bottomRight' });
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

    // Lista de tipos de depósito (en este caso, solo "Ahorro")
    const depositTypes = [
        { label: 'Ahorro', value: '672c63e14206664f86000000' }
    ];

    return (
        <Modal
            title="Agregar Nuevo Depósito"
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
                    label="Título del Depósito"
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
                    rules={[{ required: true, message: 'Por favor seleccione el tipo de depósito' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Selecciona un tipo"
                        options={depositTypes} // Lista de tipos de depósito
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }} className="button-group">
                    <Button onClick={handleCancel} style={{ width: '140px' }}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '140px', marginLeft: '16px' }}>
                        Crear Depósito
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAdd;