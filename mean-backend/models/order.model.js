const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name:String,
    image:String,
    price:Number,
    quantity:Number,


});

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    orderNumber:{
        type:String,
        unique:true
    },
    items: [orderItemSchema],
    totalPrice:{
        type:Number,
        required: true
    },
    address: {
    city: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String, required: true },
    label: String
  },
  status: {
    type: String,
    enum: ['Pending','Preparing' , 'Rejected' ,'Confirmed','Delivered','Cancelled', 'Cancelled by Admin'],
    default: 'Pending'
  },
  paymentMethod:{
    type: String,
    enum: ['cash'],
    required: true
  },
  statusHistory:[
    {
        status:String,
        changedAt: {type: Date, default:Date.now},
        changedBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
    }

  ]
}, {timestamps:true});

orderSchema.pre('save', async function(next){
    if(!this.orderNumber){
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD-${Date.now()}- ${count+1}`;
    }
    next;
})

module.exports = mongoose.model('Order', orderSchema);
