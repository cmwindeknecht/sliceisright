import { Order } from "./Order";

export interface User {
  email: string;
  isAdmin: boolean;
  orders: Order[];
}

export interface UserResponse {
  entity: {
    email: string;
    jwtToken: string;
    isAdmin: boolean;
  };
  response: string;
}
