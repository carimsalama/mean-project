import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IOrderAddress, IOrderBody, IOrderListResponse, IOrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiURL = environment.apiURL +'orders';
  constructor(private _http:HttpClient){}
  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  placeOrder(body:IOrderBody){
    return this._http.post<IOrderResponse>(this.apiURL,body,this.getHeaders());
  }
  getOrders(){
    return this._http.get<IOrderListResponse>(`${this.apiURL}/my-orders`,this.getHeaders());
  }

  getOrdersById(id:string){
    return this._http.get<IOrderResponse>(`${this.apiURL}/${id}`,this.getHeaders())
  }
  cancelOrder(id:string){
    return this._http.put<IOrderResponse>(`${this.apiURL}/${id}/cancel`,{}, this.getHeaders())
  }
  
  getAllproducts(){
    return this._http.get<IOrderResponse>(`${this.apiURL}/orders`, this.getHeaders())
  }
  

  
}
