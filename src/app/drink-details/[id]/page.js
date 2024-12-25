"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DrinkDetails from '../../components/DrinkDetails'; // Adjusted path

const DrinkDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Ensure this correctly extracts the id
  const [drinkDetails, setDrinkDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (id) {
      fetch(`/api/drink-id/${id}`)
        .then(response => {
          if (!response.ok) {
            console.error('Network response was not ok:', response.status, response.statusText);
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setDrinkDetails(data);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch(error => {
          console.error('Error fetching drink details:', error);
          setLoading(false); // Set loading to false in case of error
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  if (!drinkDetails) {
    return <div>Drink not found</div>; // Handle case where drink details are not found
  }

  return (
    <div>
      <DrinkDetails drink={drinkDetails} onBack={() => router.back()} />
    </div>
  );
};

export default DrinkDetailsPage;