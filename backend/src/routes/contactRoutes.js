const express = require('express');
const router = express.Router();
const { createContact, getContacts, markAsRead, deleteContact, getUnreadCount } = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', createContact);
router.get('/', protect, admin, getContacts);
router.get('/unread-count', protect, admin, getUnreadCount);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
