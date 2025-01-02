import React, { useState } from 'react';

const OrderStatusButton = () => {
  const [status, setStatus] = useState('Preparing'); // Default status

  const toggleStatus = () => {
    setStatus((prevStatus) => (prevStatus === 'Preparing' ? 'Ready' : 'Preparing'));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <button
        onClick={toggleStatus}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: status === 'Ready' ? 'green' : 'orange',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
      >
        {status}
      </button>
    </div>
  );
};

export default OrderStatusButton;
