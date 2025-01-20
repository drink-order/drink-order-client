"use client";

import { useState, useEffect } from 'react';
import OrderInterface from './components/OrderInterface';

export default function ShopLocationPage() {
    const [canOrder, setCanOrder] = useState(false);
    const [message, setMessage] = useState('Checking your location...');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            setMessage('Geolocation is not supported by your browser.');
        }

        function successCallback(position) {
            const { latitude, longitude } = position.coords;

            fetch('/shop-location/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        setCanOrder(true);
                    } else {
                        setMessage(data.message);
                    }
                })
                .catch(() => {
                    setMessage('Error connecting to the server. Please try again later.');
                });
        }

        function errorCallback(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setMessage('You denied the request for location access.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    setMessage('Location information is unavailable.');
                    break;
                case error.TIMEOUT:
                    setMessage('The request to get your location timed out.');
                    break;
                default:
                    setMessage('An unknown error occurred.');
                    break;
            }
        }
    }, []);

    return (
        <div>
            {canOrder ? (
                <OrderInterface />
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
}
