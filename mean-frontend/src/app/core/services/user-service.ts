import { IUpdateProfile, IUserSingle } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IUserRes } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http:HttpClient){}
 private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  private apiURL = environment.apiURL+'users';
  getUsers(){
    return this._http.get<IUserRes>(this.apiURL,this.getHeaders());
  }
  deleteUser(id:string){
    return this._http.delete<IUserRes>(`${this.apiURL}/${id}`,this.getHeaders())
  }

  getProfile (){
    return this._http.get<IUserSingle>(`${this.apiURL}/me`,this.getHeaders());

  }

  updateProfile(body:IUpdateProfile){
    
    return this._http.put<IUserSingle>(`${this.apiURL}/me`,body,this.getHeaders());
  }
  updateProfileWithImage(formData: FormData) {
  return this._http.put<IUserSingle>(
    `${this.apiURL}/me`,
    formData,
    this.getHeaders()
  );
}
  
  
}
