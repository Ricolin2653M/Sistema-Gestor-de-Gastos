import React from 'react';
import { Modal, Button, notification } from 'antd';
import { depositService } from '../../services/deposit.services';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const ModalDelete = ({ isVisible, onCancel, deposito, loading, setLoading, fetchData, userId }) => {
    const openNotificationWithIcon = (type, message, icon) => {
        notification[type]({
            message: message,
            icon: icon,
        });
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await depositService.deleteDeposit(token, deposito._id, userId);

            await fetchData();

            // Cerrar la modal
            onCancel(); 

            // Notificación de éxito
            openNotificationWithIcon('success', 'Depósito eliminado exitosamente', <DeleteOutlined style={{ color: 'red' }} />);
        } catch (error) {
            console.error('Error al eliminar el depósito:', error);
            openNotificationWithIcon('error', 'Error al eliminar el depósito', <DeleteOutlined style={{ color: 'red' }} />);
        } finally {
            setLoading(false);
        }
    };

    // Formatear la fecha usando moment
    const formattedDate = deposito && deposito.date ? moment(deposito.date).format('YYYY-MM-DD HH:mm') : '';

    return (
        <Modal
            title="Eliminar Depósito"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancelar
                </Button>,
                <Button 
                    key="delete" 
                    type="primary" 
                    loading={loading} 
                    onClick={handleDelete} 
                    className="modal-button submit-button"
                >
                    Eliminar
                </Button>,
            ]}
        >
            <p>¿Está seguro de que desea eliminar el depósito con monto {deposito && deposito.amount} con fecha {formattedDate}?</p>
        </Modal>
    );
};

export default ModalDelete;
