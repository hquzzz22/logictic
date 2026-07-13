const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { protect } = require('../middlewares/authMiddleware');

// Public route for tracking widget
router.get('/track/:trackingNumber', shipmentController.trackShipment);

// Protected admin routes
router.route('/')
  .get(protect, shipmentController.getAllShipments)
  .post(protect, shipmentController.createShipment);

router.route('/:id')
  .get(protect, shipmentController.getShipmentById)
  .put(protect, shipmentController.updateShipment)
  .delete(protect, shipmentController.deleteShipment);

router.post('/:id/timeline', protect, shipmentController.addTimelineEvent);
router.delete('/:id/timeline/:eventId', protect, shipmentController.deleteTimelineEvent);

module.exports = router;
