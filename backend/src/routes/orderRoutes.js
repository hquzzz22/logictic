const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Stats phải đặt trước /:id
router.get('/stats', protect, admin, getOrderStats);
router.get('/myorders', protect, getMyOrders);

router.route('/').post(addOrderItems).get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, admin, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
