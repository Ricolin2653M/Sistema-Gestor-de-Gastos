import React from 'react';
import { Button, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

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
    // Puedes agregar más datos si quieres extender la tabla
  ];

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: () => <Button shape="round">Deposit</Button>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} />
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 20,
        height: '380vh', // Ajusta la altura del contenedor para que la tabla ocupe más espacio
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100' }}>
        <h1>Deposits</h1>
        <Button icon={<PlusOutlined />} type="primary">
          Add transaction
        </Button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{ height: '100%' }} // Hace que la tabla se ajuste al tamaño del contenedor
        />
      </div>
    </div>
  );
};

export default Deposits;
