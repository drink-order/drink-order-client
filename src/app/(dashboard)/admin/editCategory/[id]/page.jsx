"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditCategoryForm from '../../components/EditCategoryForm';

const getCategoryById = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/api/category/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch Category: ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return { category: null };
  }
};

export default function EditCategoryPage() {
  const params = useParams();
  const { id } = params;

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
    return <div>Category not found</div>;
  }

  return (
    <>
      <EditCategoryForm id={id} nameCategory={data.category.nameCategory} />
    </>
  );
}