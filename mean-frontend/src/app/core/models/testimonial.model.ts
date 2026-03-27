export interface ITestimonial {
  _id: string;
  userId: {
    _id: string;
    name: string;
    image: string | null;
    email:string;
  };
  message: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export interface ITestimonialRes {
  success: boolean;
  data: ITestimonial[];
}

export interface ISubmitTestimonial {
  message: string;
  rating: number;
}