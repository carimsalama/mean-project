const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const GetItemsInCart = (userId)=> Cart.findOne({userId}).populate('items.productId','name image price stock');

const getCart = async (req, res)=>{
    try {
        const IdUser = req.user._id;
        let cart = await GetItemsInCart(IdUser);
        if(!cart){
            cart = await Cart.create({userId: IdUser, items:[],totalPrice:0})
        }
        res.status(200).json({sucess:true,message:'Your Cart', data:cart})
    }
    catch (error){
        res.status(500).json({success: false, message:error.message});
    }
};

const addToCart = async (req,res)=>{
    try {
        const IdUser = req.user._id;
        const {productId, quantity=1} = req.body;
        const product = await Product.findById(productId);
        if(!product || !product.isActive){
          return res.status(404).json({ success: false, message: 'Product not found' })
        }
        if(product.stock < Number(quantity)){
            return res.status(400).json({ success: false, message: `Only ${product.stock} items available` })
        }
        let cart = await Cart.findOne({userId : IdUser });
        if (!cart){
            cart = new Cart({userId : IdUser, items: []});
        }
        const exitsingIndex = cart.items.findIndex(
            item=> item.productId.toString() === productId.toString()
        );  
        if (exitsingIndex > -1){
            const newQty = cart.items[exitsingIndex].quantity + quantity;
            if(newQty>product.stock){
               return res.status(400).json({ success: false, message: `Only ${product.stock} items available` });
            }
        cart.items[exitsingIndex].quantity = newQty;
        }
        else {
      cart.items.push({ productId, quantity, price: product.price });
        }
    await cart.save();
    const itemsInCart = await GetItemsInCart(IdUser);
    res.status(200).json({success: true, message: "Item added to cart", data:itemsInCart})
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const updateCartItem = async(req,res)=>{
    try {
        const {quantity} = req.body;
    const user_id = req.user._id;
    const item_id = req.params.itemId;
    const cart = await Cart.findOne({userId: user_id});
    
    if(!cart) return res.status(404).json({success:false, message:'Cart Not Found!'});

    const item = cart.items.id(item_id);
    // const item = cart.items.find(i => i._id.toString() === item_id);
  
    
    if(!item) return res.status(404).json({success: false,message:'Item not found in cart'})

    const product = await Product.find(item.productId);
    if(quantity>product.stock){
      return res.status(400).json({ success: false, message: `Only ${product.stock} items available` });
    }
    item.quantity = quantity;
    await cart.save();

    const updatedCart = await GetItemsInCart(user_id);
    res.status(200).json({success:true , message:'Cart updated',data : updatedCart})
    }
    catch(error) {
    res.status(500).json({ success: false, message: error.message });
    }
};

const removeCartItem = async(req,res)=>{
    try{
        const user_id = req.user._id;
        const item_id = req.params.itemId;
        const cart = await Cart.findOne({userId:user_id });
        if(!cart) return res.status(404).json({success:false, message: 'Cart not found'})
        
        cart.items= cart.items.filter(item=>item._id.toString() !== item_id)
        await cart.save();
        const newCart = await GetItemsInCart(user_id);
        res.json({success:true, message:'Item removed',data:newCart})
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalPrice: 0 }
    );
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {getCart, addToCart,updateCartItem, removeCartItem, clearCart}
