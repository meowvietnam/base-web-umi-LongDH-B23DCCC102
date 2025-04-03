import { Order, Product, OrderStatus } from "./types";

const STORAGE_KEY = "orders";

export const getOrdersFromLocalStorage = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveOrdersToLocalStorage = (orders: Order[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};