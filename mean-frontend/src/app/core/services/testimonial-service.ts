import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ITestimonialRes, ISubmitTestimonial } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
    private apiURL = environment.apiURL+'testimonial';
  
    constructor(private _http:HttpClient){}
 
    private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  getApprovedTestimonials(){
    return this._http.get<ITestimonialRes>(`${this.apiURL}/testimonials`, this.getHeaders());
  }

  submitTestimonial(data:ISubmitTestimonial ){
    return this._http.post<ITestimonialRes>(`${this.apiURL}/testimonials`, data,this.getHeaders());
  }

    getAllTestimonials(){
    return this._http.get<ITestimonialRes>(`${this.apiURL}/admin`, this.getHeaders());
  }

  updateTestimonialStatus(id:string,isApproved:boolean ){
    return this._http.put<ITestimonialRes>(`${this.apiURL}/admin/${id}`, {isApproved},this.getHeaders());
  }
   deleteTestimonial(id:string ){
    return this._http.delete<ITestimonialRes>(`${this.apiURL}/admin/${id}`,this.getHeaders());
  }


}
