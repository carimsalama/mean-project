const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Product name is required'],
        trim:true
    },
    description:{
        type:String,
        required:[true, 'Description is required']
    },
    slug:{
        type:String,
        required:[true, 'Slug is required']
    },
    image:{
        type:String,
        required:[true,'Image is required']
    },
    price:{
        type:Number,
        required:[true, "Price is required"],
        min:[0, 'Price cannot be negative']
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: [true, 'Category is required']
    },
    subCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required:[true, 'SubCategory is required']
    },
    stock:{
        type:Number,
        required:[true,'stock is required'],
        min:[0,'stock cannot be negative'],
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});


module.exports = mongoose.model('Product', productSchema);
