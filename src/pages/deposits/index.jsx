import React, { useContext, useEffect, useState } from 'react';
import { Button, notification, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { depositService } from '../../services/deposit.services';
import moment from 'moment';
import ModalAdd from '../../componets/DepositsModals/ModalAdd';
import ModalEdit from '../../componets/DepositsModals/ModalEdit';
import ModalDelete from '../../componets/DepositsModals/ModalDelete';
import './depositos.css';

// Imports push notifications
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Deposits = ({ showAddButton = true }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositToEdit, setDepositToEdit] = useState(null);
  const [depositToDelete, setDepositToDelete] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchDeposits(user._id);
      onMessage(messaging, message => {
        toast(message.notification.title);
      });
    }
  }, [user]);

  const fetchDeposits = async (userId) => {
    try {
      const depositsData = await depositService.getDeposits(token, userId);
      setDeposits(depositsData);
    } catch (error) {
      notification.error({ message: 'Error al obtener los depósitos' });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
  };

  const handleEditClick = (deposit) => {
    setDepositToEdit(deposit);
    setIsEditModalVisible(true);
  };

  const handleDeleteClick = (deposit) => {
    setDepositToDelete(deposit);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (type ? type : "No Type"),
      width: 150,
      className: 'deposits-table-column-type',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
      width: 200,
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
      width: 200,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            shape="circle"
            className="deposits-hover-edit"
            onClick={() => handleEditClick(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            className="deposits-hover-delete"
            onClick={() => handleDeleteClick(record)}
          />
        </>
      ),
      width: 150,
      className: 'deposits-table-column-actions',
    },
  ];

  return (
    <>
      <br />
      <div className="deposits-container">
        <ToastContainer />
        <div className="deposits-header">
          <h1 className="deposits-title">Depósitos</h1>
          {showAddButton && (
            <button className="deposits-add-button" onClick={showModal}>
              <p className="deposits-add-text">Agregar depósito </p>
              <span className="deposits-icon">
                <PlusOutlined />
              </span>
            </button>
          )}
        </div>

        <div className="deposits-table-container">
          <Table
            columns={columns}
            dataSource={deposits}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            scroll={{ y: 300 }}
          />
        </div>

        <ModalAdd
          isVisible={isModalVisible}
          onCancel={handleCancel}
          loading={loading}
          setLoading={setLoading}
          fetchData={() => fetchDeposits(userId)}
          userId={userId}
        />

        <ModalEdit
          isVisible={isEditModalVisible}
          onCancel={handleCancel}
          loading={loading}
          setLoading={setLoading}
          deposito={depositToEdit}
          fetchData={() => fetchDeposits(userId)}
          userId={userId}
        />

        <ModalDelete
          isVisible={isDeleteModalVisible}
          onCancel={handleCancel}
          deposito={depositToDelete}
          loading={loading}
          setLoading={setLoading}
          fetchData={() => fetchDeposits(userId)}
          userId={userId}
        />
      </div>
    </>
  );
};

export default Deposits;
