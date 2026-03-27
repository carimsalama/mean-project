import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ICart } from '../../core/models/cart.model';
import { IAddress } from '../../core/models/address.model';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address-service';
import { IOrderBody } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order-service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cart: ICart |null = null;
  addresses : IAddress[]= [];
  selectedAddress: IAddress | null = null;
  staticURL = environment.staticFilesURL;
showNewAddress = false;
 isLoading = false;
  errorMsg = '';
 checkoutForm: FormGroup =new FormGroup({
    items: new FormControl(''),
    status: new FormControl(''),
    address: new FormControl(''),
    delivery: new FormControl('standard'),
    newAddress: new FormGroup({
      label:    new FormControl(''),
      city:     new FormControl(''),
      street:   new FormControl(''),
      building: new FormControl('')
    }),
    paymentMethod :new FormControl('cash'),
  })


  constructor(private _cartService:CartService,
    private _addressService:AddressService,
    private _orderService:OrderService,
    private _router:Router,
    private cdr:ChangeDetectorRef
  ){}
 ngOnInit(): void {

  this._cartService.getCart().subscribe({
    next: (res) => {
      this.cart = res.data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });

  this._addressService.getAddres().subscribe({
    next: (res) => {
      this.addresses = res.data;

      if (this.addresses.length > 0) {
        this.selectAddress(this.addresses[0]);
      }

      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });

}
 selectAddress(addr :IAddress){
      this.selectedAddress = addr;
      this.checkoutForm.patchValue({addressId:addr._id})

 }


saveAddress() {
    const group = this.checkoutForm.get('newAddress') as FormGroup;
    if (group.invalid) { group.markAllAsTouched(); return; }

    this._addressService.addAddress(group.value).subscribe({
      next: (res) => {
        this.addresses.push(res.data);
        this.selectAddress(res.data);
        this.showNewAddress = false;
        group.reset();
      },
      error: (err) => console.error(err)
    });
  }

  toggleNewAddress(){
    this.showNewAddress = !this.showNewAddress;
    const group = this.checkoutForm.get('newAddress') as FormGroup;
    if (this.showNewAddress) {
     
      Object.keys(group.controls).forEach(key => {
        group.get(key)?.setValidators(Validators.required);
        group.get(key)?.updateValueAndValidity();
      });
    } else {
      
      Object.keys(group.controls).forEach(key => {
        group.get(key)?.clearValidators();
        group.get(key)?.updateValueAndValidity();
      });
      group.reset();
    }
  }


  get totalPrice(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((sum, item) =>
      sum + (item.productId.price * item.quantity), 0);
  }


  placeOrder() {
    if (!this.selectedAddress && !this.showNewAddress) {
      this.errorMsg = 'Please select a shipping address.';
      return;
    }
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';


    const body:IOrderBody = {paymentMethod:'cash'}

    if(this.showNewAddress){
      body.newAddress= this.checkoutForm.get('newAddress')?.value;
    }
    else {
      body.addressId = this.selectedAddress?._id;
    }
    
    this._orderService.placeOrder(body).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.cart = null;
      this._cartService.resetCount();

      this._router.navigate(['/orders']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMsg = err.error?.message || 'Something went wrong.';
    }
  });

  
  }

}
