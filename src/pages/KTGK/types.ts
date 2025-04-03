export interface Order {
    id: string;
    customer: string;
    orderDate: string; // ISO format
    totalAmount: number;
    status: OrderStatus;
    products: Product[];
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  export enum OrderStatus {
    PENDING = "Chờ xác nhận",
    SHIPPING = "Đang giao",
    COMPLETED = "Hoàn thành",
    CANCELLED = "Hủy",
  }