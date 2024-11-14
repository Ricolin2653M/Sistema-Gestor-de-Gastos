import React, { useContext, useEffect, useState } from 'react';
import { Button, notification, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { depositService } from '../../services/deposit.services';
import moment from 'moment';
import ModalAdd from '../../componets/DepositsModals/ModalAdd'; // Asegúrate de importar la modal

const Deposits = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad de la modal
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchDeposits(user._id);
      console.log("USER ID " +userId)
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
    setIsModalVisible(true); // Mostrar la modal al hacer clic
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Cerrar la modal
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
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} shape="circle" className="hover-edit" />
          <Button icon={<DeleteOutlined />} shape="circle" className="hover-delete" />
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
        fetchData={() => fetchDeposits(userId)} // Pasamos la función para actualizar los datos después de agregar un depósito
        userId={userId} // Asegúrate de pasar el userId al modal aquí
      />
    </div>
  );
};

export default Deposits;