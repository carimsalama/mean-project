import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDashboardResponse } from '../models/admin.model';
import { IOrderListResponsePagination, IOrderParams, IOrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _http:HttpClient){}
  private apiURL = environment.apiURL;

   private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };

  }

  getReport(startDate?: string, endDate?: string){
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate)   params = params.set('endDate',   endDate);
    return this._http.get<IDashboardResponse>(`${this.apiURL}admin/reports`,{...this.getHeaders(),
      params
    })
  }
 




  getAllOrders(params?: IOrderParams) {
    const query = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof IOrderParams];
        if (value !== null && value !== undefined && value !== '') {
          query.append(key, value.toString());
        }
      });
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    
    return this._http.get<IOrderListResponsePagination>(
      `${this.apiURL}orders/orders${queryString}`,
      this.getHeaders() 
    );
  }

  updateOrderStatus(id:string,status:string){
    return this._http.put<IOrderResponse>(`${this.apiURL}orders/orders/${id}/status`,{status}, this.getHeaders())
  }
}
