import { Order } from './Order';

export interface User {
  orders: Order[];
  email: string
}