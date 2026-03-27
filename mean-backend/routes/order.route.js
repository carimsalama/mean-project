const router = require('express').Router();
const {placeOrder,getOrderById,cancelOrder,getAllOrders,getMyOrders,updateOrderStatus} = require('../controller/order.controller');
const {protect, isAdmin}= require('../middleware/auth.middleware');

// router.use(protect);
router.post('/',protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/orders',protect, isAdmin, getAllOrders);
router.get('/:id',protect, getOrderById);
router.put('/:id/cancel',protect, cancelOrder);
router.put('/orders/:id/status',protect, isAdmin, updateOrderStatus);



module.exports = router;
