import { Order } from './Order';

export interface User {
  orders: Order[];
  email: string;
  isAdmin: boolean;
}

export interface UserResponse {
    entity: { 
      email: string; 
      jwtToken: string;
      isAdmin: boolean;
    };
    response: string;
}