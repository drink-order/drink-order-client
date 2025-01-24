import fs from 'fs';
import path from 'path';

const ordersFilePath = path.resolve(process.cwd(), 'orders.json');

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

export const createOrder = (newOrder) => {
  const orders = readOrdersFromFile();
  orders.push(newOrder);
  writeOrdersToFile(orders);
  return newOrder;
};

export const getOrders = (userId) => {
  const orders = readOrdersFromFile();
  return orders.filter(order => order.userId === userId);
};

export const deleteOrderItem = (userId, itemId) => {
  const orders = readOrdersFromFile();
  const userOrders = orders.find(order => order.userId === userId);
  if (userOrders) {
    userOrders.items = userOrders.items.filter(item => item.id !== itemId);
    writeOrdersToFile(orders);
  }
};

export const getOrderStatus = (orderId) => {
  const orders = readOrdersFromFile();
  const order = orders.find(order => order.id === orderId);
  return order ? order.status : null;
};

export const updateOrderStatus = (orderId, status) => {
  const orders = readOrdersFromFile();
  const order = orders.find(order => order.id === orderId);
  if (order) {
    order.status = status;
    writeOrdersToFile(orders);
    return order;
  }
  return null;
};