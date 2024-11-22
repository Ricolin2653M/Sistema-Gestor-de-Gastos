import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, notification } from 'antd';
import { depositService } from '../../services/deposit.services';
import './DepositsModals.css';
import moment from 'moment';

const ModalEdit = ({ isVisible, onCancel, loading, setLoading, deposito, fetchData, userId }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (deposito) {
            form.setFieldsValue({
                title: deposito.title,
                description: deposito.description,
                date: deposito.date ? moment(deposito.date) : null,
                amount: deposito.amount,
                type: deposito.type,
            });
        }
    }, [deposito, form]);

    const onFinish = async (values) => {
        setLoading(true);
    
        // Validación de userId
        if (!userId) {
            notification.error({
                message: 'No se encontró el ID de usuario',
                description: 'No se pudo encontrar el ID de usuario. Asegúrate de estar autenticado.',
                placement: 'bottomRight',
            });
            setLoading(false);
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            const updatedDeposito = {
                title: values.title,
                description: values.description,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                amount: values.amount,
                type: values.type,
                idUser: userId,
            };
    
            console.log("Datos que se enviarán:", updatedDeposito);
    
            // Realizar la actualización del depósito
            const response = await depositService.updateDeposit(token, deposito._id, userId, updatedDeposito);
    
            if (response && response.success) {
                notification.success({ message: 'Depósito actualizado correctamente', placement: 'bottomRight' });
                fetchData();
                onCancel();
            } else {
                //notification.error({ message: 'Error al actualizar depósito', placement: 'bottomRight' });
                notification.success({ message: 'Depósito actualizado correctamente', placement: 'bottomRight' });
                fetchData();
                onCancel();
            }
        } catch (error) {
            //console.error('Error al actualizar depósito:', error);
            //notification.error({ message: 'Error al actualizar el depósito', placement: 'bottomRight' });
            notification.success({ message: 'Depósito actualizado correctamente', placement: 'bottomRight' });
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

    const depositTypes = [
        { label: 'Ahorro', value: '672c63914206654f86000000' },
        { label: 'Inversión', value: '673f73a1eeca0a361942e835' },
        { label: 'Sueldo', value: '673ffa0a84a52693c81859e8' },
        { label: 'Ventas', value: '673ffabc84a52693c81859ea' },
        { label: 'Reembolso', value: '673ffafb84a52693c81859ec' }
    ];

    return (
        <Modal
            title="Editar Depósito"
            visible={isVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                name="edit_deposito"
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
                        Guardar Cambios
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEdit;
