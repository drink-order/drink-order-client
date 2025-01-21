import fs from 'fs';
import path from 'path';

const dataDirPath = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDirPath, 'drinks.json');

// Ensure the data directory and file exist
const ensureDataFileExists = () => {
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath);
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
  }
};

// Read drinks from file
const readDrinksFromFile = () => {
  try {
    ensureDataFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading drinks from file:', error);
    return [];
  }
};

// Write drinks to file
const writeDrinksToFile = (drinks) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(drinks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing drinks to file:', error);
  }
};

let drinks = readDrinksFromFile();
let currentId = drinks.length > 0 ? Math.max(...drinks.map(d => d.id)) : 0;

export const getDrinks = () => {
  return drinks;
};

export const getDrinkById = (id) => {
  return drinks.find(drink => drink.id === id);
};

export const createDrink = (newDrink) => {
  currentId += 1;
  const drinkWithId = { id: currentId, ...newDrink };
  drinks.push(drinkWithId);
  writeDrinksToFile(drinks);
  return drinkWithId;
};

export const updateDrink = (id, updatedDrink) => {
  const index = drinks.findIndex(drink => drink.id === id);
  if (index !== -1) {
    drinks[index] = { ...drinks[index], ...updatedDrink };
    writeDrinksToFile(drinks);
    return drinks[index];
  }
  return null;
};

export const deleteDrink = (id) => {
  const index = drinks.findIndex(drink => drink.id === id);
  if (index !== -1) {
    const deletedDrink = drinks.splice(index, 1);
    writeDrinksToFile(drinks);
    return deletedDrink[0];
  }
  return null;
};