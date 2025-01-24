import fs from 'fs';
import path from 'path';

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
  const userFilePath = path.join(dataDirPath, `${userId}_orders.json`);
  if (!fs.existsSync(userFilePath)) {
    fs.writeFileSync(userFilePath, JSON.stringify([]), 'utf8');
  }
  return userFilePath;
};

// Read orders from file for a specific user
const readOrdersFromFile = (userId) => {
  try {
    ensureDataDirExists();
    const userFilePath = ensureUserDataFileExists(userId);
    const data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders from file:', error);
    return [];
  }
};

// Write orders to file for a specific user
const writeOrdersToFile = (userId, orders) => {
  try {
    const userFilePath = ensureUserDataFileExists(userId);
    fs.writeFileSync(userFilePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing orders to file:', error);
  }
};

export const createOrder = (userId, orderData) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const orders = readOrdersFromFile(userId);
  const currentOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) : 0;
  const newOrder = { id: currentOrderId + 1, ...orderData };
  orders.push(newOrder);
  writeOrdersToFile(userId, orders);
  return newOrder;
};

export const getOrders = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return readOrdersFromFile(userId);
};

export const updateOrder = (userId, orderId, updateData) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const orders = readOrdersFromFile(userId);
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  orders[orderIndex] = { ...orders[orderIndex], ...updateData };
  writeOrdersToFile(userId, orders);
  return orders[orderIndex];
};

export const deleteOrder = (userId, orderId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  let orders = readOrdersFromFile(userId);
  orders = orders.filter(order => order.id !== orderId);
  writeOrdersToFile(userId, orders);
};