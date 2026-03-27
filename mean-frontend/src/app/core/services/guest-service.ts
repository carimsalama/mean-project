import { Injectable } from '@angular/core';
import { IGuestCartItem } from '../models/guest.model';
import { ICartProduct } from '../models/cart.model';
import { Iproduct } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class GuestService {

  private key = 'guest_cart';

  getItems(): IGuestCartItem[]{
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];

  }

  addItem(product: Iproduct, quantity:number){
    const items = this.getItems();
    const existing = items.find(i=>i.productId === product._id)
    if(existing){
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      items.push({productId: product._id,
        name:product.name,
        image:product.image,
        price: product.price,
        stock: product.stock,
        quantity
      })

    }
  this.save(items);
  }

  updateItem(productId: string, quantity:number){
    const items = this.getItems();
    const item = items.find(i => i.productId === productId);
    if(item) item.quantity = quantity;
    this.save(items)
  }
removeItem(productId: string) {
    const items = this.getItems().filter(i => i.productId !== productId);
    this.save(items);
  }
clear() {
    localStorage.removeItem(this.key);
  }
  getCount(): number {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  }
  private save(items: IGuestCartItem[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
