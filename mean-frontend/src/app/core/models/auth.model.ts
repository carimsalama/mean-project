export interface ILoginData{
    email:string;
    password:string;
}
export interface ILoginRes {
    success:boolean;
    message:string;
    token:string;
}

export interface ITokenData{
    _id:string;
    name:string;
    role:string;
    iat:string;
    exp:string;
}

export interface IRegister{
  name: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
}

export interface IRegisterRes{
    success:boolean;
    message:string;
    token:string;
}