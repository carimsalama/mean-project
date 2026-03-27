const Category = require('../models/category.model');
const subCategory = require('../models/subCategory.model');
const Product = require('../models/product.model');

const getCategories = async (req, res)=>{
    try {
    const filter = { isActive: true }; 
      const filteredName =req.query.name;
      if (filteredName){
        filter.name= filteredName;
      }
      const categories = await Category.find(filter);
      res.status(200).json({success:true, data:categories})
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}
const getAdminCategories = async (req, res)=>{
    try {
    const filter = { }; 
      const filteredName =req.query.name;
      if (filteredName){
        filter.name= filteredName;
      }
      const categories = await Category.find(filter);
      res.status(200).json({success:true, data:categories})
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const getCategoryById = async (req, res)=>{
    try{
    const id = req.params.id;
    const category = await Category.findById({id, isActive: true}); 
    if(!category){
        return res.status(404).json({success:false,message: 'Category not found'});
    }
    const subcategories= await subCategory.find({categoryId: id});
    res.status(200).json({success:true, category, subcategories});
    }
    catch (error){
        res.status(500).json({ success: false, message: error.message });

    }
}


const createCategory = async(req, res)=>{
    try {
        const {name,isActive} = req.body;
        const category = await Category.create({name, isActive});
        res.status(201).json({success:true, message:'Category created', data:category})
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const updateCategory = async (req, res) => {
  try {
    const {name, isActive} = req.body;

    const category = await Category.findByIdAndUpdate(req.params.id, {name, isActive}, { new: true });
    if (!category)
        {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
            

    res.json({ success: true, message: 'Category updated', data:category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const deleteCategory = async (req,res)=>{
    try {
    const id =req.params.id
    // Prevent deletion if products exist under this category
    const hasProducts = await Product.findOne({ categoryId: id, isActive: true }); 
    if(hasProducts){
        return res.status(400).json({success:false, message: 'Cannot delete category with existing products'})
    }

    await subCategory.updateMany({ categoryId: id }, { isActive: false });
      const deleted = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true }); 
    if (!deleted) { return res.status(404).json({
    success:false,
    message:"Category not found"
  });
}
    res.status(200).json({success: true, message: 'Category deleted'});
    }
    catch (error){

}
} 


// ══════════════════════════════════════════════
// SUBCATEGORIES
// ══════════════════════════════════════════════

const getSubCategories = async (req, res) => {
  try {
    const filter = {};
    const categoryID = req.query.categoryId
    if (categoryID){
        filter.categoryId = categoryID;
    } 

    const subcategories = await subCategory.find(filter).populate('categoryId', 'name');
     res.status(200).json({ success: true, message:'Your SubCategory',data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) 
        {return res.status(404).json({ success: false, message: 'Category not found' });}

    const subcategory = await subCategory.create({ name, categoryId });
    res.status(201).json({ success: true, message: 'SubCategory created', data:subcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const updateSubCategory = async (req, res) => {
  try {
    const {name,categoryId} = req.body;
    const subcategory = await subCategory.findByIdAndUpdate(req.params.id, {name,categoryId}, { new: true });
    if (!subcategory) return res.status(404).json({ success: false, message: 'SubCategory not found' });
    res.status(200).json({ success: true, message: 'SubCategory updated', data: subcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const deleteSubCategory = async (req, res) => {
  try {
    
    const id = req.params.id;
const hasProducts = await Product.findOne({ subCategoryId: id, isActive: true }); 
    if (hasProducts) {
      return res.status(400).json({ success: false, message: 'Cannot delete subcategory with existing products' });
    }

    const deleted = await subCategory.findByIdAndUpdate(id, { isActive: false }, { new: true }); 
    if (!deleted) { return res.status(404).json({
    success:false,
    message:"SubCategory not found",
    data: deleted
  });
}
    

   res.status(200).json({ success: true, message: 'SubCategory deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {createCategory,getAdminCategories,getCategories,
     getCategoryById,deleteCategory, updateCategory,
     deleteSubCategory,updateSubCategory,createSubCategory,getSubCategories
    }