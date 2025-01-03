import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SuccessAnimate = ({ width = '200px', height = '200px' }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '10px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <DotLottieReact
          src="https://lottie.host/8f08d4c6-4d08-4757-9cd8-d2e3c9ec27ba/XRFI3eNv3C.lottie"
          loop
          autoplay
          style={{ width, height }}
        />
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <h2 style={{ fontSize: '20px', margin: '10px 0', fontWeight: 'normal' }}>Hey Dear,</h2>
        <h1 style={{ fontSize: '24px', margin: '10px 0', fontWeight: 'bold' }}>Your Order is Confirmed!</h1>
        <p style={{ fontSize: '16px', margin: '10px 0', color: '#666' }}>
          Keep track of the order status, we will send you a notification when the order is ready to serve.
        </p>
      </div>
    </div>
  );
};


export default SuccessAnimate;
