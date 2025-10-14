import { Order } from './Order';

export interface User {
  orders: Order[];
  email: string
}

export interface UserResponse {
    entity: { 
      email: string; 
      jwtToken: string 
    };
    response: string;
}