import React, { useContext, useEffect, useState } from 'react';
import { Button, notification, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { expenseService } from '../../services/expense.services';
import moment from 'moment';
import ModalAdd from '../../componets/ExpensesModals/ModalAdd'; 
import ModalEdit from '../../componets/ExpensesModals/ModalEdit';
import ModalDelete from '../../componets/ExpensesModals/ModalDelete';

//Imports push notifications
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Expenses = ({ showAddButton }) => {  // Recibimos la propiedad showAddButton
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseToEdit, setexpenseToEdit] = useState(null);
  const [expenseToDelete, setexpenseToDelete] = useState(null);

  const getTokenNotification = async () => {
    const token = await getToken(messaging, {
        vapidKey: 'BFm1JIsWvokI9-0Y1HAX9QxPH0Vmvcph9U5jGYZkq2OMDc8S8sHrNAqGzTfxNL8D4KTETCIw39F9t7po-f9AoLM'
    }).catch((err) => console.log('No se pudo obtener el token', err))

    if (token) {
        console.log('Token si: ', token)
    }
    if (!token) {
        console.log('No se pudo obtener el token')
    }
  };

  const notificarme = () => {
      if (!window.Notification) {
          console.log('Este navegador no soporta notificaciones');
          return;
      }
      if (Notification.permission === 'granted') {
          getTokenNotification(); //Obtener y mostrar el token en la consola
      }
      else if(Notification.permission !== 'denied' || Notification.permission === 'default'){
          Notification.requestPermission((permission) => {
              console.log(permission)
              if (permission === 'granted') {
                  getTokenNotification(); //Obtener y mostrar el token en la consola
              }
          });
      }
  };
  notificarme();

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchDeposits(user._id);

      getTokenNotification()
        onMessage(messaging, message => {
            console.log('onMessage: ', message)
            toast( message.notification.title)
            console.log(message.notification.title)
    })

    }
  }, [user]);

  const fetchDeposits = async (userId) => {
    try {
      const depositsData = await expenseService.getExpenses(token, userId);
      setDeposits(depositsData);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      notification.error({ message: 'Error al obtener los gastos' });
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
    setexpenseToEdit(deposit);
    setIsEditModalVisible(true);
  };

  const handleDeleteClick = (deposit) => {
    setexpenseToDelete(deposit);
    setIsDeleteModalVisible(true);
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
            onClick={() => handleDeleteClick(record)} // Eliminar al hacer clic
          />
        </>
      ),
      width: 150,
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="deposits-titulo">Payments</h1>

        {/* Mostrar el botón solo si showAddButton es verdadero */}
        {showAddButton && (
          <button className="add-transaction-btn" onClick={showModal}>
            <p className="add-transaction-name">Add payments</p>
            <span className="icon">
              <PlusOutlined />
            </span>
          </button>
        )}
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

      {/* Modal para agregar nuevo gasto */}
      <ModalAdd 
        isVisible={isModalVisible} 
        onCancel={handleCancel} 
        loading={loading} 
        setLoading={setLoading} 
        fetchData={() => fetchDeposits(userId)} 
        userId={userId}
      />

      {/* Modal para editar un gasto */}
      <ModalEdit 
        isVisible={isEditModalVisible} 
        onCancel={handleCancel} 
        loading={loading} 
        setLoading={setLoading} 
        expense={expenseToEdit} 
        fetchData={() => fetchDeposits(userId)} 
        userId={userId}
      />
      {/* Modal para eliminar un gasto */}
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
  );
};

export default Expenses;
