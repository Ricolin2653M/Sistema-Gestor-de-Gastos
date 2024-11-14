import React, { useContext, useEffect, useState } from 'react';
import { Button, notification, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { depositService } from '../../services/deposit.services';
import moment from 'moment';
import ModalAdd from '../../componets/DepositsModals/ModalAdd'; 
import ModalEdit from '../../componets/DepositsModals/ModalEdit'; // Importa el ModalEdit

const Deposits = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Para mostrar la modal de edición
  const [loading, setLoading] = useState(false);
  const [depositToEdit, setDepositToEdit] = useState(null); // Para manejar el depósito a editar

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchDeposits(user._id);
    }
  }, [user]);

  const fetchDeposits = async (userId) => {
    try {
      const depositsData = await depositService.getDeposits(token, userId);
      setDeposits(depositsData);
    } catch (error) {
      console.error('Error al obtener los depósitos:', error);
      notification.error({ message: 'Error al obtener los depósitos' });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false); // Cerrar también la modal de edición
  };

  const handleEditClick = (deposit) => {
    setDepositToEdit(deposit); // Establecer el depósito a editar
    setIsEditModalVisible(true); // Mostrar la modal de edición
  };

  const handleDeleteClick = async (depositId) => {
    try {
      await depositService.deleteDeposit(token, depositId);
      notification.success({ message: 'Depósito eliminado correctamente' });
      fetchDeposits(userId); // Refrescar la lista de depósitos
    } catch (error) {
      console.error('Error al eliminar depósito:', error);
      notification.error({ message: 'Error al eliminar el depósito' });
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        type && type.length > 0 ? type.join(", ") : "No Type"
      ),
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
      width: 200,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 200,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button 
            icon={<EditOutlined />} 
            style={{ marginRight: 8 }} 
            shape="circle" 
            className="hover-edit" 
            onClick={() => handleEditClick(record)} // Editar al hacer clic
          />
          <Button 
            icon={<DeleteOutlined />} 
            shape="circle" 
            className="hover-delete" 
            onClick={() => handleDeleteClick(record._id)} // Eliminar al hacer clic
          />
        </>
      ),
      width: 150,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="deposits-titulo">Deposits</h1>
        <button className="add-transaction-btn" onClick={showModal}>
          <p className="add-transaction-name">Add deposit</p>
          <span className="icon">
            <PlusOutlined />
          </span>
        </button>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          dataSource={deposits}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ y: 300 }}
        />
      </div>

      {/* Modal para agregar nuevo depósito */}
      <ModalAdd 
        isVisible={isModalVisible} 
        onCancel={handleCancel} 
        loading={loading} 
        setLoading={setLoading} 
        fetchData={() => fetchDeposits(userId)} 
        userId={userId}
      />

      {/* Modal para editar un depósito */}
      <ModalEdit 
        isVisible={isEditModalVisible} 
        onCancel={handleCancel} 
        loading={loading} 
        setLoading={setLoading} 
        deposito={depositToEdit} 
        fetchData={() => fetchDeposits(userId)} 
        userId={userId}
      />
    </div>
  );
};

export default Deposits;
