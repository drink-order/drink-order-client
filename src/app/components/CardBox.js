"use client"
import React from 'react';
import { FaFire } from 'react-icons/fa';

const CardBox = ({ name, description, price, originalPrice, image }) => {
  return (
    <div className="max-w-4xs bg-white shadow-md overflow-hidden flex items-center">
      
        <div className="p-4 flex flex-col justify-between w-full">
            <h3 className="text-xl mt-4 font-semibold">{name}</h3>
            <p className="text-gray-600 mt-2 text-sm">{description}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-gray-800">${price}</span>
                <span className="text-sm line-through text-gray-500">${originalPrice}</span>
            </div>
            <div className="flex justify-between items-center"> 
            <div className="flex items-center text-orange-500 text-sm">
                    <FaFire />
                    <span>Popular</span>
                </div>
                <button className="bg-primary px-2 rounded-full">
                    <span className="text-secondary text-xl">+</span>
                </button>
            </div>
        </div>
        <img 
            src={image} 
            alt={name} 
            className="w-48 h-[150px] rounded-lg object-cover mr-4" 
        />
    </div>
  );
};

export default CardBox;