import React from 'react';
import { Button, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import "../deposits/depositos.css";

const Deposits = () => {
  const data = [
    {
      key: '1',
      type: 'Deposit',
      description: 'Deposito de pago en mi trabajo',
      date: '2024-10-10',
      amount: '$10,000.00 MXN',
    },
    {
      key: '2',
      type: 'Deposit',
      description: 'Deposito de pago en mi trabajo',
      date: '2024-10-10',
      amount: '$10,000.00 MXN',
    },
    {
      key: '3',
      type: 'Deposit',
      description: 'Deposito de pago en mi trabajo',
      date: '2024-10-10',
      amount: '$10,000.00 MXN',
    },
    // Puedes agregar más datos para probar el scroll
  ];

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: () => <Button shape="round">Deposit</Button>,
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
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
      render: () => (
        <>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} shape="circle" className="hover-edit"/>
          <Button icon={<DeleteOutlined />} shape="circle"  className="hover-delete" // Añadir clase hover-delete
          />
        </>
      ),
      width: 150,
    },
  ];

  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="deposits-titulo">Deposits</h1>
        <button className="add-transaction-btn">
        <p className="add-transaction-name">Add transaction</p>
        <span className="icon">
            <PlusOutlined /> {/* Cambia este ícono según el de tu preferencia */}
        </span>
</button>

      </div>

      <div className="table-container">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }} 
        />
      </div>
    </div>
  );
};

export default Deposits;
