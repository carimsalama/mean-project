const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model')

const getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const orderFilter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const ordersByStatus = await Order.aggregate([
      { $match: orderFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const revenueResult = await Order.aggregate([
      { $match: { ...orderFilter, status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const ordersPerDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const bestSellers = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    const totalUsers = await User.countDocuments({ role: 'user' });

    const totalProducts = await Product.countDocuments({ isActive: true });

    const totalOrders = await Order.countDocuments(orderFilter);

   
  const lowStock = await Product.find({ stock: { $lte: 5 }, isActive: true })
  .populate('categoryId', 'name')
  .sort({ stock: 1 })
  .limit(10);

  const recentOrders= await Order.find()
  .populate('userId', 'name email phone')
  .sort({createdAt : -1})
  .limit(5);

    res.status(200).json({
      success: true,
      reports: {
        summary: {
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts
        },
        ordersByStatus,
        ordersPerDay,
        bestSellers,
        lowStock,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {getReports};
