export interface ICartProduct {
    _id:string;
    name:string;
    image:string;
    price:number;
    stock:number;

}

export interface ICartItem {
     _id:string;
    productId: ICartProduct;
    quantity:number;
    price:number;
    
}

export interface ICart{
     _id: string;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  
}

export interface ICartResponse {
  success: boolean;
  message:string;
  data: ICart;
}