"use client"
import { useState, useEffect } from 'react';
import OrderInterface from '../components/orderInterface';

export default function Home() {
    const [canOrder, setCanOrder] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            setMessage('Geolocation is not supported by your browser.');
        }

        function successCallback(position) {
            const { latitude, longitude } = position.coords;

            fetch('http://localhost:3000/shop-location/page/api/check-location', {
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
                setMessage('Error checking your location.');
            });

            // fetch('/api/shop-location/check-location')
            // .then(response => response.json())
            // .then(data => console.log(data))
            // .catch(error => console.error('Error:', error));

        }

        function errorCallback() {
            setMessage('Unable to retrieve your location.');
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
