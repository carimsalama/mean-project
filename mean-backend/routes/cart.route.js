const router = require('express').Router();
const {getCart, addToCart,updateCartItem, removeCartItem, clearCart} = require('../controller/cart.controller');

const {protect} = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getCart);
router.post('/add',addToCart);
router.put('/item/:itemId',updateCartItem);
router.delete('/item/:itemId',removeCartItem);
router.delete('/clear',clearCart);

module.exports = router;