import React, { useEffect } from 'react';
import { Modal, Input, Form, notification, DatePicker, Button } from 'antd';
import { depositService } from '../../services/deposit.services';
import moment from 'moment';
import './DepositsModals.css';

const ModalEdit = ({ isVisible, onCancel, loading, setLoading, deposito, fetchData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (deposito) {
            form.setFieldsValue({
                monto: deposito.monto,
                fecha: deposito.fecha ? moment(deposito.fecha) : null,
                descripcion: deposito.descripcion,
            });
        }
    }, [deposito, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const depositoData = {
                monto: values.monto,
                fecha: values.fecha ? values.fecha.format('YYYY-MM-DD') : null,
                descripcion: values.descripcion,
            };

            await depositService.updateDeposit(token, deposito._id, depositoData);
            notification.success({ message: 'Depósito actualizado correctamente' });
            fetchData();
            onCancel();
        } catch (error) {
            console.error('Error al actualizar depósito:', error);
            notification.error({ message: 'Error al actualizar el depósito' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Editar Depósito"
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                name="edit_deposito"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="monto"
                    label="Monto"
                    rules={[{ required: true, message: 'Por favor ingrese el monto' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="fecha"
                    label="Fecha del Depósito"
                    rules={[{ required: true, message: 'Por favor seleccione la fecha del depósito' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    name="descripcion"
                    label="Descripción"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }} className="button-group">
                    <Button onClick={onCancel} style={{ width: '140px' }}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '140px', marginLeft: '16px' }}>
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEdit;
