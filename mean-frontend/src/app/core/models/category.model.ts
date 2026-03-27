export interface ICat {
    _id:string;
    isActive:boolean;
    name:string;
    createdAt:string;
    updatedAt:string;
}
export interface InewCategory {
  name: string;
  isActive: boolean;
}

export interface ICategory{
    success:boolean;
    message:string;
    data:ICat[];
}

export interface ISubCat{
    _id:string;
    isActive:boolean;
    name:string;
    createdAt:string;
    updatedAt:string;
    categoryId:{
        _id:string;
        name:string;
    }
}

export interface IUpdateSubCat {
  name: string;
  categoryId: string;
}

export interface ISubCategory{
    success:boolean;
    message:string;
    data:ISubCat[];
}