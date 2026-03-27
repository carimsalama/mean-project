import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IOrder } from '../../core/models/order.model';
import { environment } from '../../../environments/environment';
import { OrderService } from '../../core/services/order-service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit{
  orders:IOrder[] = [];
  staticURL = environment.staticFilesURL;
  constructor(private _orderService:OrderService, private cdr:ChangeDetectorRef){}


  ngOnInit(): void {

    this.loadOrders();
  
  }

  loadOrders(){
    
    this._orderService.getOrders().subscribe({
      next: (res) => {
        this.orders= res.data;
        console.log(res);
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  cancelOrder(orderId: string) {
    this._orderService.cancelOrder(orderId).subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === orderId);
        if (order) order.status = 'Cancelled';
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

}
