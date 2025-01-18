let categories = [
    { _id: '1', idCategory: 'cat1', nameCategory: 'Category 1' },
    { _id: '2', idCategory: 'cat2', nameCategory: 'Category 2' },
    // Add more mock categories as needed
  ];
  
  export const getCategories = () => {
    return categories;
  };
  
  export const getCategoryById = (id) => {
    return categories.find(category => category._id === id);
  };
  
  export const createCategory = (newCategory) => {
    categories.push(newCategory);
    return newCategory;
  };
  
  export const updateCategory = (id, updatedCategory) => {
    const index = categories.findIndex(category => category._id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedCategory };
      return categories[index];
    }
    return null;
  };
  
  export const deleteCategory = (id) => {
    const index = categories.findIndex(category => category._id === id);
    if (index !== -1) {
      const deletedCategory = categories.splice(index, 1);
      return deletedCategory[0];
    }
    return null;
  };