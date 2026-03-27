import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin-service';
import { IOrder, IOrderItem, IOrderParams, Ipaginate } from '../../core/models/order.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit{
  orders: IOrder[] = [];
    pagination: Ipaginate | null = null;
    currentPage = 1;
    showForm = false;
  selectedOrder: IOrder | null = null;
  statusFilter = new FormControl('');
    
    readonly statuses = ['Pending', 'Preparing', 'Rejected' ,'Confirmed', 'Delivered', 'Cancelled','Cancelled by Admin'];
statusForm: FormGroup = new FormGroup({
    status: new FormControl('', Validators.required)
  });

  constructor(private cdr:ChangeDetectorRef,
    private _adminService: AdminService ){}
  ngOnInit(): void {
    this.loadOrders();
    this.statusFilter.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadOrders();
    });
  }
  loadOrders(){
      const params: IOrderParams = { page: this.currentPage, limit: 5 };
      if (this.statusFilter.value) params.status = this.statusFilter.value;

    this._adminService.getAllOrders(params).subscribe((res)=>{
      this.orders = res.data || [];
      console.log(this.orders);
      
      
      this.pagination = res.pagination;
       this.cdr.detectChanges();
      

    })

  }
  openEdit(order: IOrder) {
    this.selectedOrder = order;
    this.statusForm.patchValue({ status: order.status });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  closeForm() {
    this.showForm = false;
    this.selectedOrder = null;
    this.statusForm.reset();
  }

  save() {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }
    
    this._adminService.updateOrderStatus(
      
      this.selectedOrder!._id,
      this.statusForm.value.status
    ).subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === this.selectedOrder!._id);
        if (order) order.status = this.statusForm.value.status;
        this.closeForm();
      },
      error: (err) => console.error(err)
    });
  }

  changePage(page: number) {
    if (!this.pagination) return;
    if (page < 1 || page > this.pagination.pages) return;
    this.currentPage = page;
    this.loadOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  getPages(): number[] {
    if (!this.pagination) return [];
    const pages = [];
    for (let i = 1; i <= this.pagination.pages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Pending':   'status-pending',
      'Preparing': 'status-processing',
      'Confirmed': 'status-shipped',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled',
      'Cancelled by Admin': 'status-cancelled'

    };
    return map[status] || '';
  }

}
