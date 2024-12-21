import React from 'react'

const Button = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-yellow-600 text-black font-bold rounded-md px-6 py-2 shadow-md hover:bg-yellow-500 transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
