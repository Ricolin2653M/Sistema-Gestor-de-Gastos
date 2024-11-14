import React, { useContext, useEffect, useState } from 'react';
import { Button, notification, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { usersService } from '../../services/users.service';
import { depositService } from '../../services/deposit.services';
import "../deposits/depositos.css";
import moment from 'moment';

const Deposits = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchDeposits(user._id);
      console.log("id de usuario", userId);
    }
  }, [user]);
/*
  const fetchUserId = async () => {
    try {
      const user = await usersService.getMe(token);
      setUserId(user._id);
      console.log("User ID:", user._id); // Agrega este console.log aquí
    } catch (error) {
      console.log("error al obtener el usuario", error);
      notification.error({ message: "error al obtener el usuario" });
    }
  };  
*/
  const fetchDeposits = async (userId) => {
    try {
      const depositsData = await depositService.getDeposits(token, userId);
      setDeposits(depositsData);
    } catch (error) {
      console.error('Error al obtener los depósitos:', error);
      notification.error({ message: 'Error al obtener los depósitos' });
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
        <button className="add-transaction-btn">
          <p className="add-transaction-name">Add transaction</p>
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
    </div>
  );
};

export default Deposits;
