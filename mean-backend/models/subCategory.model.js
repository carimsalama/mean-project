const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'SubCategory name is required'],
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  isActive:{
        type:Boolean,
        default:true
    }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
