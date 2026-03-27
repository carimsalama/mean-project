import { IAddress } from "./address.model";

export interface IOrderItem{
    _id:string;
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface IOrderAddress {
  label: string;
  city: string;
  street: string;
  building: string;
}
export interface IUserOrder {
  
    _id:string;
    name: string;
    email: string;
    phone: string;

}

export interface IStatusHistory {
  _id: string;
  status: string;
  changedBy: string;
  changedAt: string;
}

export interface IOrder {
    _id:string;
    userId:IUserOrder;
    items:IOrderItem[];
    totalPrice:string;
    address:IOrderAddress; 
    status:string;
    paymentMethod:string;
    statusHistory: IStatusHistory[];
    orderNumber: string;
    createdAt:string;

}

export interface IOrderBody{
    addressId?:string;
    paymentMethod:string;
    newAddress?: IOrderAddress;
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  data: IOrder;
}

export interface Ipaginate {
  total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface IOrderParams {
    page?: number;
    status?: string | null;
    limit?: number;
}



export interface IOrderListResponse {
  success: boolean;
  data: IOrder[];
}
export interface IOrderListResponsePagination {
  success: boolean;
  data: IOrder[];
  pagination: Ipaginate
}
