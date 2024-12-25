import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height for centering
      }}
    >
      <div
        style={{
          width: '30vw', // Adjusts to 20% of the viewport width
          height: '30vw', // Ensures the same size for width and height
          maxWidth: '300px', // Sets a maximum size
          maxHeight: '300px', // Matches the max width for a square
          borderRadius: '50%', // Makes it a circle
          overflow: 'hidden',
        }}
      >
        <DotLottieReact
          src="https://lottie.host/a27b23d2-8521-4252-b45c-3b50fc41e9a0/M05iWQJJ22.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Loading;
