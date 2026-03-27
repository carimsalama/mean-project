const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Address = require('../models/address.model');


const placeOrder = async (req, res)=>{
    try {
        
    const {addressId,paymentMethod='cash',newAddress}= req.body;
    
    const cart = await Cart.findOne({userId: req.user._id}).populate('items.productId');
    if (!cart || cart.items.length === 0){
        return res.status(400).json({success:false, message:'Cart is Empty'});
    }

    let address;
    if (newAddress){
        address = newAddress;
    }
    else if (addressId){
        const userAddress= await Address.findOne({_id :addressId,userId:req.user._id});
        if(!userAddress){
        return res.status(404).json({success:false, message:'Address Not Found!'});
    }
    address = {city:userAddress.city,
         street: userAddress.street,
         building: userAddress.building,
         label: userAddress.label
    }
    } else {
        return res.status(400).json({success: false, message: 'Address is required'})
    }

    const orderItems = [];
    for (const item of cart.items){
        const product = item.productId;
        if(!product ||!product.isActive){
        return res.status(400).json({ success: false, message: `Product "${product?.name}" is no longer available` });
        }
        if (product.stock < item.quantity){
        return res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}". Available: ${product.stock}` });
        }
        orderItems.push({
            productId:product._id,
            name:product.name,
            image:product.image,
            price:product.price,
            quantity:item.quantity,
        });
    }


    const order = await Order.create({
        userId: req.user._id,
        items:orderItems,
        totalPrice: cart.totalPrice,
        address,
        paymentMethod: paymentMethod ||'cash',
        statusHistory:[{status: 'Pending', changedBy: req.user._id}]

    })

    for (const item of cart.items){
        await Product.findByIdAndUpdate(item.productId._id,{
            $inc: {stock: -item.quantity}
        });
    }

    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], totalPrice: 0 });

    res.status(201).json({ success: true, message: 'Order placed successfully', data:order });

    }
    catch(error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) 
       {
         return res.status(404).json({ success: false, message: 'Order not found' });
       }

    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res)=>{
    try {
    const {page=1 , limit=10, status}= req.query;
    const filter = {userId: req.user._id};
    if (status){
        filter.status = status;
    }
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
        .sort({createdAt :-1})
        .skip(( (page-1) * limit))
        .limit(Number(limit));

        res.status(200).json({
            success:true,
            data:orders,
            pagination:{total, page:Number(page),pages:Math.ceil(total/limit)}
        });

    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}
const cancelOrder = async(req, res)=>{
    try {
        const order = await Order.findOne({_id:req.params.id, userId : req.user._id});
        if(!order)
        {
            return res.status(404).json({success:false , message: 'Order Not Found'});
        }

        if (order.status !=='Pending'){
            return res.status(400).json({
                success:false,
                message:`Cannot cancel order with status -${order.status}-. Only Pending Order can be cancelled `
            });
        }

        order.status = 'Cancelled';
        order.statusHistory.push({ status: 'Cancelled', changedBy: req.user._id });

        for (const item of order.items){
            await Product.findByIdAndUpdate(item.productId, {$inc: {stock:item.quantity}});
        }
        await order.save();
        res.status(200).json({success:true, message:'Order Cancelled',data:order});
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}


const getAllOrders = async (req, res)=>{
    try {
    const {page=1, limit=5, status} = req.query;
    const filter = {};
    if (status){
        filter.status = status;
    }
    const total = await Order.countDocuments(filter);
    const orders= await Order.find(filter)
    .populate('userId', 'name email phone')
    .sort({createdAt: -1})
    .skip((page-1) * limit)
    .limit(Number(limit));

    res.status(200).json({
      success: true,
      data:orders,
      pagination: { total, page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)

       }
    });

    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const updateOrderStatus = async (req,res)=>{
    try {
    const {status}= req.body;
    const validStatuses = ['Pending','Preparing','Confirmed','Delivered','Cancelled', 'Cancelled by Admin'];
    
    if (!validStatuses.includes(status)){
        return res.status(400).json({success: false, message: 'Invalid status'})
    }
    const order = await Order.findById(req.params.id);
    if (!order){
    return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if ((status === 'Cancelled' && order.status !== 'Cancelled') || (status === 'Cancelled by Admin' && order.status !== 'Cancelled by Admin') ){
        for (const item of order.items){
            await Product.findByIdAndUpdate(item.productId, { $inc:{stock: item.quantity}})
        }
    }
    order.status = status;
    order.statusHistory.push({ status, changedBy: req.user._id });
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated', order });
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });

    }
}



module.exports = {placeOrder, getMyOrders,getOrderById,
    cancelOrder,    
    getAllOrders, updateOrderStatus}
