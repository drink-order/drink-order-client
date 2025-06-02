import React, { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function Removebtn({ id, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the category.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirmed.isConfirmed) {
      setLoading(true);
      await onDelete(id);
      setLoading(false);

      Swal.fire({
        title: 'Deleted!',
        text: 'The category has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="text-red-500 hover:text-red-700 disabled:opacity-50"
      disabled={loading}
      title="Delete category"
    >
      <HiOutlineTrash size={24} />
    </button>
  );
}
