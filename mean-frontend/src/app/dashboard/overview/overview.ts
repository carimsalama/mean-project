import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product-service';
import { OrderService } from '../../core/services/order-service';
import { AuthService } from '../../core/services/auth-service';
import { AdminService } from '../../core/services/admin-service';
import { environment } from '../../../environments/environment';
import { IBestSeller, ILowStockProduct, IOrderByStatus, IOrderPerDay, IRecentOrder, ISummary } from '../../core/models/admin.model';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit{
    staticURL = environment.staticFilesURL;
     summary!: ISummary ;
     ordersByStatus: IOrderByStatus[]  = [];
  ordersPerDay:   IOrderPerDay[] = [];
  bestSellers:    IBestSeller[] = [];
  lowStock: ILowStockProduct[] =[];
  recentOrders: IRecentOrder[] = [];


  startDate = new FormControl('');
  endDate   = new FormControl('');

 
constructor(
    private cdr:ChangeDetectorRef,
    private _adminService: AdminService
  ) {}

   ngOnInit(): void {
    this.getReports()

  }

  getReports(startDate?: string, endDate?: string){
    this._adminService.getReport(startDate,endDate).subscribe({
      next: (res) => {
        this.summary        = res.reports.summary;
        this.ordersByStatus = res.reports.ordersByStatus || [];
        this.ordersPerDay   = res.reports.ordersPerDay   || [];
        this.bestSellers    = res.reports.bestSellers     || [];
        this.lowStock = res.reports.lowStock || [];
        this.recentOrders = res.reports.recentOrders || [];
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

   applyFilter() {
    const start = this.startDate.value;
    const end   = this.endDate.value;

    if (!start || !end) return;

    // format to match your API: MM-DD-YYYY
    const formatted = (date: string) => {
      const [year, month, day] = date.split('-');
      return `${month}-${day}-${year}`;

    };

    this.getReports(formatted(start), formatted(end));
        this.cdr.detectChanges();

  }

  clearFilter() {
    this.startDate.setValue('');
    this.endDate.setValue('');
    this.getReports();
        this.cdr.detectChanges();

  }



getStatusClass(status: string): string {
    const map: Record<string, string> = {
      
      'Pending':    'dot-pending    fill-pending',
      'Preparing': 'dot-preparing fill-preparing',
      'Shipped':    'dot-shipped    fill-shipped',
      'Delivered':  'dot-delivered  fill-delivered',
      'Confirmed':   'dot-confirmed  fill-confirmed', 
      'Cancelled':  'dot-cancelled  fill-cancelled',
      'Cancelled by Admin':  'dot-cancelled  fill-cancelled'

    };
    return map[status] || '';
  }

  getStatusPercent(count: number): number {
    const max = Math.max(...this.ordersByStatus.map(s => s.count));
    return max ? Math.round((count / max) * 100) : 0;
  }

  getDayPercent(count: number): number {
    const max = Math.max(...this.ordersPerDay.map(d => d.count));
    return max ? Math.round((count / max) * 100) : 0;
  }
  }


