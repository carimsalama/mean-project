export interface IAddress {
  _id: string;
  label: string;
  city: string;
  street: string;
  building: string;
}

export interface IAddressResponse {
  success: boolean;
  message:string;
  data: IAddress[];
}

export interface IAddressSingleResponse {
  success: boolean;
  message:string;
  data: IAddress;
}