import fs from 'fs';
import path from 'path';

const dataDirPath = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDirPath, 'categories.json');

// Ensure the data directory and file exist
const ensureDataFileExists = () => {
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath);
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
  }
};

// Read categories from file
const readCategoriesFromFile = () => {
  try {
    ensureDataFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    console.log('Read categories from file:', data); // Debugging log
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading categories from file:', error);
    return [];
  }
};

// Write categories to file
const writeCategoriesToFile = (categories) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2), 'utf8');
    console.log('Written categories to file:', categories); // Debugging log
  } catch (error) {
    console.error('Error writing categories to file:', error);
  }
};

let categories = readCategoriesFromFile();
let currentId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) : 0;

export const getCategories = () => {
  return categories;
};

export const getCategoryById = (id) => {
  const category = categories.find(category => category.id === id);
  console.log('Fetched category by ID:', category); // Debugging log
  return category;
};

export const createCategory = (newCategory) => {
  currentId += 1; // Increment the counter
  const categoryWithId = { id: currentId, ...newCategory };
  categories.push(categoryWithId);
  writeCategoriesToFile(categories); // Persist data to file
  return categoryWithId;
};

export const updateCategory = (id, updatedCategory) => {
  const index = categories.findIndex(category => category.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updatedCategory };
    writeCategoriesToFile(categories); // Persist data to file
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id) => {
  const index = categories.findIndex(category => category.id === id);
  if (index !== -1) {
    const deletedCategory = categories.splice(index, 1);
    writeCategoriesToFile(categories); // Persist data to file
    return deletedCategory[0];
  }
  return null;
};