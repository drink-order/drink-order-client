import ProductForm from './ProductForm';

const EditProductForm = ({ product, onBack, onUpdate }) => {
  return (
    <ProductForm 
      product={product}
      onBack={onBack}
      onSubmit={onUpdate}
      isEdit={true}
    />
  );
};

export default EditProductForm;