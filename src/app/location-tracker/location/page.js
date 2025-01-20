"use client"

import { useState, useEffect } from "react";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Function to get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          setLocation({ latitude: userLatitude, longitude: userLongitude });
        },
        (error) => {
          setError(error.message); // Capture any error that occurs while retrieving location
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Trigger getting the location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div>
      <h1>Get User Location</h1>
      {error && <p>Error: {error}</p>}
      {location ? (
        <p>
          Your location:<br />
          Latitude: {location.latitude}<br />
          Longitude: {location.longitude}
        </p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

