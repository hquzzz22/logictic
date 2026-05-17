const express = require('express');
const router = express.Router();
const { getSetting, getAllSettings, updateSetting } = require('../controllers/settingController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getAllSettings);
router.get('/:key', getSetting);
router.put('/:key', protect, admin, updateSetting);

module.exports = router;
