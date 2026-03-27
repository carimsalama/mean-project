export interface IUser {
_id:string;
name : string;
email : string;
password : string;
phone : string;
gender : string;
role : string;
image : string;
createdAt:string;
}


export interface IUserRes {
    success:string;
    data: IUser[];
}

export interface IUserSingle {
  success: boolean;
  data: IUser;
}

export interface IUpdateProfile {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  password?: string;
}