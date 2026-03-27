// models/dashboard.model.ts

import { IOrderAddress, IOrderItem, IStatusHistory, IUserOrder } from "./order.model";

export interface ISummary {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

export interface IOrderByStatus {
  _id: string;
  count: number;
}

export interface IOrderPerDay {
  _id: string;
  count: number;
  revenue: number;
}


export interface IBestSeller {
  _id: string;
  name: string;
  image: string;
  totalSold: number;
  totalRevenue: number;
}
export interface ILowStockProduct {
  _id: string;
  name: string;
  image: string;
  stock: number;
  price: number;
  categoryId: {
    _id: string;
    name: string;
  };
}

export interface IRecentOrder{
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
export interface IReports {
  summary: ISummary;
  ordersByStatus: IOrderByStatus[];
  ordersPerDay: IOrderPerDay[];
  bestSellers: IBestSeller[];
  lowStock: ILowStockProduct[];
  recentOrders: IRecentOrder[];

}

export interface IDashboardResponse {
  success: boolean;
  reports: IReports;
}