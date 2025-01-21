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

let categories = readCategoriesFromFile();

export const getCategories = () => {
  return categories;
};