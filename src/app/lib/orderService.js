import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataDirPath = path.join(process.cwd(), 'data');

// Ensure the data directory exists
const ensureDataDirExists = () => {
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath);
  }
};

// Ensure the data file exists for a specific user
const ensureUserDataFileExists = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const userFilePath = path.join(dataDirPath, `${userId}_cart.json`);
  if (!fs.existsSync(userFilePath)) {
    fs.writeFileSync(userFilePath, JSON.stringify([]), 'utf8');
  }
  return userFilePath;
};

// Read cart from file for a specific user
const readCartFromFile = (userId) => {
  try {
    ensureDataDirExists();
    const userFilePath = ensureUserDataFileExists(userId);
    const data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cart from file:', error);
    return [];
  }
};

// Write cart to file for a specific user
const writeCartToFile = (userId, cart) => {
  try {
    const userFilePath = ensureUserDataFileExists(userId);
    fs.writeFileSync(userFilePath, JSON.stringify(cart, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing cart to file:', error);
  }
};

export const getCart = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const cart = readCartFromFile(userId);
  return cart;
};

export const addToCart = (userId, orderData) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const cart = readCartFromFile(userId);
  const newItem = { ...orderData, userId, id: uuidv4() };
  cart.push(newItem);
  writeCartToFile(userId, cart);
  return newItem;
};

export const removeFromCart = (userId, itemId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  let cart = readCartFromFile(userId);
  cart = cart.filter(item => item.id !== itemId);
  writeCartToFile(userId, cart);
  return true;
};

export const clearCart = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  writeCartToFile(userId, []);
  return true;
};