const Product = require('../models/product.model');

const getProducts = async (req, res)=>{
    try {
        const {search, category, sub, minPrice,maxPrice, page = 1, limit =10 } = req.query;
        
        let filter = {isActive:true};

        if (search){
        filter.name = { $regex: search, $options: 'i' }
        }
        if (category){
            filter.categoryId = category;
        }
        if (sub){
            filter.subCategoryId = sub;
        }
        if (minPrice || maxPrice){
            filter.price = {}
            if(minPrice) filter.price.$gte = Number(minPrice);
            if(maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        const skip = (Number(page)- 1) * Number(limit)
        const total = await Product.countDocuments(filter)

        const products = await Product.find(filter)
        .populate('categoryId', 'name')
        .populate('subCategoryId', 'name')
        .sort({createdAt:-1})
        .skip(skip)
        .limit(Number(limit));

        res.json({
            success: true,
            products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        
        })

    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }


}
const getAdminProducts = async (req, res) => {
  try {
    const { search, category, sub, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let filter = {}; 

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.categoryId = category;
    }
    if (sub) {
      filter.subCategoryId = sub;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .populate('subCategoryId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page:  Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
    .populate('categoryId','name')
    .populate('subCategoryId','name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Can't find product with slug: ${slug}`,
      });
    }

    
    const related = await Product.find({
      slug: { $ne: slug },
      isActive: true
    }).limit(4);


    res.status(200).json({
      success: true,
      message: `Product found by slug: ${slug}`,
      data: product,
      related:related
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getProductById = async(req, res)=>{
    try {
    const product = await Product.findById(req.params.id)
    .populate('categoryId','name')
    .populate('subCategoryId', 'name');
    
    if(!product || !product.isActive){
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      subCategoryId: product.subCategoryId,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.json({ success: true, product, related });

    }
    catch (error) 
    {

    }
}

const createProduct = async (req, res)=>{
    try {
    const {name, description, price, categoryId,  subCategoryId, stock,slug} = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }
    const product = await Product.create({
        name, description, price, categoryId, subCategoryId,slug,stock,
      image: `/uploads/${req.file.filename}`
        
    });    
    res.status(201).json({success:true, message:'Product created', data: product})

    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const updateProduct = async(req, res)=>{
    try {
    const updateData = { ...req.body };
    id = req.params.id;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(id, updateData,{
        new:true,
        runValidators: true
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated', product });
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const deleteProduct = async (req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(
        req.params.id,
        {isActive :false}, 
        {new: true}
        );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' ,data:product});


    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });

    }
}


module.exports = { getProducts,getAdminProducts , createProduct, getProductById,updateProduct, deleteProduct, getProductBySlug };
