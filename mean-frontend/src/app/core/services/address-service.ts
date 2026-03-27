import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAddress, IAddressResponse, IAddressSingleResponse } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {

  private apiURL = environment.apiURL+'address';

  constructor(private _http:HttpClient){}

  private getHeaders(){
    const token = localStorage.getItem('token');
    return {
      headers:{
        Authorization:`Bearer ${token}`
      }
    };
  }

  getAddres(){
    return this._http.get<IAddressResponse>(this.apiURL,this.getHeaders());
  }

  addAddress(data:IAddress){
    return this._http.post<IAddressSingleResponse>(this.apiURL, data, this.getHeaders())
  }

  updateAddress(addressId:string, data:IAddress){
    return this._http.put<IAddressResponse>(`${this.apiURL}/${addressId}`,data,this.getHeaders())
  }
  
  deleteAddress (addressId:string){
    return this._http.delete(`${this.apiURL}/${addressId}`, this.getHeaders())
  }

}
