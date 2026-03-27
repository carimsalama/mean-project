import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from './../../core/models/testimonial.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css',
})
export class Testimonial  implements OnInit{
  testimonials: ITestimonial[] = []
  showForm = false;
  selectedItem: ITestimonial | null = null;

  statusForm: FormGroup = new FormGroup({
    isApproved: new FormControl('', Validators.required)
  });

  constructor(private _testimonialService:TestimonialService,
    private cdr:ChangeDetectorRef
  ){}


  ngOnInit(): void {
    this.loadTestimonial()
  }

  loadTestimonial(){
    this._testimonialService.getAllTestimonials().subscribe({
      next: (res) =>{
        this.testimonials = res.data || [];
        this.cdr.detectChanges();
      } ,
      error: (err) => console.error(err)
    });
  }

   openEdit(item: ITestimonial) {
    this.selectedItem = item;
    this.statusForm.patchValue({ isApproved: item.isApproved });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

   closeForm() {
    this.showForm     = false;
    this.selectedItem = null;
    this.statusForm.reset();
  }

  save() {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const isApproved = this.statusForm.value.isApproved === 'true' ||
                       this.statusForm.value.isApproved === true;

    this._testimonialService.updateTestimonialStatus(this.selectedItem!._id,isApproved).subscribe({
      next: () => {
        // const item = this.testimonials.find(t => t._id === this.selectedItem!._id);
        // if (item) item.isApproved = isApproved;
        this.loadTestimonial();
        this.closeForm();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  delete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    this._testimonialService.deleteTestimonial(id).subscribe({
      next: () => this.loadTestimonial(),
      error: (err) => console.error(err)
    });
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  getStatusClass(isApproved: boolean): string {
    return isApproved ? 'status-delivered' : 'status-pending';
  }

}
