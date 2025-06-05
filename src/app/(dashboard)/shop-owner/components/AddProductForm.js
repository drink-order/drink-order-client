import ProductForm from './ProductForm';

const AddProductForm = ({ onBack, onAdd }) => {
  return (
    <ProductForm 
      onBack={onBack}
      onSubmit={onAdd}
      isEdit={false}
    />
  );
};

export default AddProductForm;