import React from 'react'
import EditCategoryForm from '../../components/EditCategoryForm';

const getCategoryById = async (id) => {
  try{
    const res = await fetch(`http://localhost:3000/admin/api/category/${id}`,{
      cache: "no-store",
    });

    if(!res.ok){
      throw new Error("Failed to fetch Category");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export default async function editCategory({ params }) {
  const { id } = params;
  const { category } = await getCategoryById(id);
  const { idCategory, nameCategory } = category;
  return (
    <>
    <EditCategoryForm id={id} idCategory={idCategory} nameCategory={nameCategory} />
    </>
  );
}