import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ICart, ICartItem } from '../../core/models/cart.model';
import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cart.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { IGuestCartItem } from '../../core/models/guest.model';
import { GuestService } from '../../core/services/guest-service';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit,OnDestroy{
cart: ICart | null = null;
staticURL = environment.staticFilesURL;
private subs = new Subscription(); 

private authState = new BehaviorSubject<boolean>(false);

_isLoggedIn = this.authState.asObservable();


guestItems :IGuestCartItem[]= []
constructor(private _cartService: CartService,
  private _authService:AuthService,
  private _guestService: GuestService,
  private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    
if (this._isLoggedIn){
      this.loadCart();
}else {
  this.guestItems = this._guestService.getItems();
}
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe(); 
  }

loadCart() {
  const sub = this._cartService.getCart().subscribe({
    next: (res) => {
      this.cart = res.data;
      if (this.cart && !this.cart.items) {
        this.cart.items = []; 
      }
    },
    error: (err) => console.error('Failed to load cart', err)
  });
  this.subs.add(sub);
}

  
recalculateTotal() {
  if (!this.cart) return;
  this.cart.totalPrice = this.cart.items.reduce((sum, item) => {
    return sum + (item.productId.price * item.quantity);
  }, 0);
}
  increase(item:ICartItem){
    if (item.quantity >= item.productId.stock) return;
      item.quantity++; 
      this.recalculateTotal();
      this.updateItem(item, item.quantity);
  }

  decrease(item:ICartItem){
    if (item.quantity <= 1) return;
      item.quantity--; 
      this.recalculateTotal();
      this.updateItem(item, item.quantity);
  }

  updateItem(item:ICartItem, quantity:number){
    const sub = this._cartService.updateCartItem(item._id, quantity).subscribe({
    next: (res) => {
      this.cart!.totalPrice = res.data.totalPrice; 
    },
    error: (err) => {
      console.error(err);
      item.quantity = quantity > 1 ? quantity - 1 : quantity + 1;
      this.recalculateTotal();    
    }
    })
      this.subs.add(sub);

  }
  removeItem (itemId:string){
        this.cart!.items = this.cart!.items.filter(item => item._id !== itemId);
      this.recalculateTotal();
    const sub = this._cartService.removeCartItem(itemId).subscribe(()=>{
     
      
    })
    this.subs.add(sub);
  }

  clearCart(){
    this._cartService.clearCart().subscribe(()=>{
      this.cart = null;
    })
  }


get guestTotal(): number {
  return this.guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

increaseGuest(item: IGuestCartItem) {
  if (item.quantity >= item.stock) return;
  item.quantity++;
  this._guestService.updateItem(item.productId, item.quantity);
}

decreaseGuest(item: IGuestCartItem) {
  if (item.quantity <= 1) return;
  item.quantity--;
  this._guestService.updateItem(item.productId, item.quantity);
}

removeGuest(productId: string) {
  this._guestService.removeItem(productId);
  this.guestItems = this._guestService.getItems();
}

  

}
