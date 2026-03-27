export interface Iproduct {
    _id:string;
     name:string;
    description:string;
    price:number;
    stock:number;
    image:string;
    slug:string;
    categoryId:{
        _id:string;
        name:string;
    };
    subCategoryId:{
        _id:string;
        name:string;
    };
    isActive:boolean;

}

export interface product {
    _id:string;
     name:string;
    description:string;
    price:number;
    stock:number;
    image:string;
    slug:string;
    categoryId:string;
    subCategoryId:string;
}

export interface IproductsRes {
  success: boolean;
  products: Iproduct[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface IproductRes {
   message:string;
   products:Iproduct;
    pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface Iproductdet {
    message:string;
    data:Iproduct;
    related:Iproduct[];
}

export interface Iproductt {
  success:boolean;
    message:string;
    data:Iproduct;
}
export interface Ipaginate {
  total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface IProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sub?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
} 