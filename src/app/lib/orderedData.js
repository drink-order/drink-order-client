import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const ordersFilePath = path.resolve(process.cwd(), 'data/orders.json');

const readOrdersFromFile = () => {
  if (!fs.existsSync(ordersFilePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(ordersFilePath, 'utf-8');
  return JSON.parse(fileContent);
};

const writeOrdersToFile = (orders) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
};

export const createOrder = (userId, orderData) => {
  const orders = readOrdersFromFile();
  const newOrder = { id: uuidv4(), userId, ...orderData };
  orders.push(newOrder);
  writeOrdersToFile(orders);
  return newOrder;
};

export const getOrders = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const orders = readOrdersFromFile();
  return orders.filter(order => order.userId === userId);
};

export const getOrderStatus = (orderId) => {
  const orders = readOrdersFromFile();
  const order = orders.find(order => order.id === orderId);
  return order ? order.status : null;
};

export const updateOrder = (userId, orderId, updateData) => {
  const orders = readOrdersFromFile();
  const orderIndex = orders.findIndex(order => order.userId === userId && order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...updateData };
    writeOrdersToFile(orders);
    return orders[orderIndex];
  }
  return null;
};

export const deleteOrder = (userId, orderId) => {
  const orders = readOrdersFromFile();
  const updatedOrders = orders.filter(order => !(order.userId === userId && order.id === orderId));
  if (updatedOrders.length === orders.length) {
    return false; // No order was removed
  }
  writeOrdersToFile(updatedOrders);
  return true;
};

export const deleteAllOrders = (userId) => {
  const orders = readOrdersFromFile();
  const updatedOrders = orders.filter(order => order.userId !== userId);
  writeOrdersToFile(updatedOrders);
  return true;
};