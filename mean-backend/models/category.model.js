const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    // name:{
    //     type:String,
    //     required:[true, 'Category name is required'],
    //     trim: true
    // },
    name:{
        type:String,
        // enum:['men','women'],
        required:[true, 'Category is required'],
        unique: true
    },
    isActive:{
        type:Boolean,
        default:true
    }
    
}, {timestamps:true});

module.exports = mongoose.model('Category', categorySchema);
