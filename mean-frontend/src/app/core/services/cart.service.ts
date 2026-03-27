import { GuestService } from './guest-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICartItem, ICartResponse } from '../models/cart.model';
import { BehaviorSubject, forkJoin, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private apiURL = environment.apiURL + 'cart';
  private cartCount = new BehaviorSubject<number>(0);
  _cartCount = this.cartCount.asObservable();
  
  constructor(private _http: HttpClient,private _guestCart:GuestService) {}

  private getHeaders(){
    const token = localStorage.getItem('token');
    return {
      headers:{
        Authorization:`Bearer ${token}`
      }
    };
  }

mergeGuestCart() {
  const items = this._guestCart.getItems();
  if (items.length === 0) return;

  const requests = items.map(item =>
    this.addToCart(item.productId, item.quantity)
  );

  forkJoin(requests).subscribe({
    next: () => {
      this._guestCart.clear();
      this.getCart().subscribe();
    },
    error: (err) => console.error('Merge failed', err)
  });
}

  private updateCount(items:ICartItem[]){
    const total = items.reduce((sum,item)=> sum +item.quantity,0);
    this.cartCount.next(total)


  }
  getCart(){
    return this._http.get<ICartResponse>(this.apiURL, this.getHeaders()).pipe(tap(res=> this.updateCount(res.data?.items || [])));
  }


  addToCart(productId:string, quantity:number){
    return this._http.post<ICartResponse>(
      `${this.apiURL}/add`,
      {productId, quantity},
      this.getHeaders()).pipe(tap(res=> this.updateCount(res.data?.items || [])));
  }

  updateCartItem(itemId:string, quantity:number){
    return this._http.put<ICartResponse>(
      `${this.apiURL}/item/${itemId}`,
      {quantity},
      this.getHeaders()).pipe(tap(res=> this.updateCount(res.data?.items || [])));
  }

  removeCartItem(itemId:string){
    return this._http.delete<ICartResponse>(
      `${this.apiURL}/item/${itemId}`,
      this.getHeaders()).pipe(tap(res=> this.updateCount(res.data?.items || [])));
  }

  clearCart(){
    return this._http.delete<ICartResponse>(
      `${this.apiURL}/clear`,
      this.getHeaders()).pipe(tap(()=>this.cartCount.next(0)));
  }

resetCount() {
  this.cartCount.next(0);
}

}