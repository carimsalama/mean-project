const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    quantity :{
        type:Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default:1
    },
    price:Number // snapshot of price at time of adding
});

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique:true
    },
    items:[cartItemSchema],
    totalPrice:{
        type:Number,
        default:0
    }
},{timestamps: true});

cartSchema.pre('save', function(next){
    this.totalPrice = this.items.reduce((sum, item)=>{
    return sum + (item.price * item.quantity);
    },0);
    next;
});

module.exports = mongoose.model('Cart', cartSchema);

