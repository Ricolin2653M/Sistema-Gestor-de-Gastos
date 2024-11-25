import React, { useContext, useEffect, useState } from 'react';
import { Button, notification, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { expenseService } from '../../services/expense.services';
import moment from 'moment';
import ModalAdd from '../../componets/ExpensesModals/ModalAdd';
import ModalEdit from '../../componets/ExpensesModals/ModalEdit';
import ModalDelete from '../../componets/ExpensesModals/ModalDelete';
import './gastos.css';

// Imports push notifications
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Expenses = ({ showAddButton = true }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchDeposits(user._id);

      getTokenNotification();
      onMessage(messaging, (message) => {
        console.log('onMessage: ', message);
        toast(message.notification.title);
      });
    }
  }, [user]);

  const getTokenNotification = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: 'BFm1JIsWvokI9-0Y1HAX9QxPH0Vmvcph9U5jGYZkq2OMDc8S8sHrNAqGzTfxNL8D4KTETCIw39F9t7po-f9AoLM',
      });
      console.log('Token: ', token || 'No se pudo obtener el token');
    } catch (err) {
      console.log('Error obteniendo token', err);
    }
  };

  const fetchDeposits = async (userId) => {
    try {
      const depositsData = await expenseService.getExpenses(token, userId);
      setDeposits(depositsData);
    } catch (error) {
      notification.error({ message: 'Error al obtener los gastos' });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
  };

  const handleEditClick = (deposit) => {
    setExpenseToEdit(deposit);
    setIsEditModalVisible(true);
  };

  const handleDeleteClick = (deposit) => {
    setExpenseToDelete(deposit);
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
      render: (type) => (type ? type : 'No Type'),
      width: 150,
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
            className="payments-edit-btn"
            onClick={() => handleEditClick(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            className="payments-delete-btn"
            onClick={() => handleDeleteClick(record)}
          />
        </>
      ),
      width: 150,
    },
  ];

  return (
    <>
    <br/>
      <div className="payments-container">
        <ToastContainer />
        <div className="payments-header">
          <h1 className="payments-title">Pagos</h1>
          {showAddButton && (
            <button className="payments-add-btn" onClick={() => setIsModalVisible(true)}>
              <span>Agregar Pagos</span>
              <PlusOutlined />
            </button>
          )}
        </div>

        <div className="payments-table-container">
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
          expense={expenseToEdit}
          fetchData={() => fetchDeposits(userId)}
          userId={userId}
        />
        <ModalDelete
          isVisible={isDeleteModalVisible}
          onCancel={handleCancel}
          expense={expenseToDelete}
          loading={loading}
          setLoading={setLoading}
          fetchData={() => fetchDeposits(userId)}
          userId={userId}
        />
      </div>
    </>
  );
};

export default Expenses;
