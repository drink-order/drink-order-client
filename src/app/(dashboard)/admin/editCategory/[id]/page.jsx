"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditCategoryForm from '../../components/EditCategoryForm';

const getCategoryById = async (id) => {
  try {
    console.log(`Fetching category with ID: ${id}`); // Debugging log
    const res = await fetch(`http://localhost:3000/admin/api/category/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch Category: ${errorText}`); // Debugging log
      throw new Error("Failed to fetch Category");
    }

    const data = await res.json();
    console.log('Fetched Category:', data); // Debugging log
    return data;
  } catch (error) {
    console.log('Error fetching category:', error);
    return { category: null };
  }
}

export default function EditCategoryPage() {
  const params = useParams();
  const { id } = params;
  console.log(`EditCategoryPage params: ${JSON.stringify(params)}`); // Debugging log

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCategoryById(id);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.category) {
    console.log('Category not found'); // Debugging log
    return <div>Category not found</div>;
  }

  return (
    <>
      <EditCategoryForm id={id} nameCategory={data.category.nameCategory} />
    </>
  );
}