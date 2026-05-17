const Contact = require('../models/Contact');

// POST /api/contacts — KH gửi tin nhắn
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json(contact);
  } catch (error) { next(error); }
};

// GET /api/contacts — Admin xem tất cả
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) { next(error); }
};

// PUT /api/contacts/:id/read — Đánh dấu đã đọc
const markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) { res.status(404); throw new Error('Không tìm thấy'); }
    res.json(contact);
  } catch (error) { next(error); }
};

// DELETE /api/contacts/:id
const deleteContact = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa' });
  } catch (error) { next(error); }
};

// GET /api/contacts/unread-count
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) { next(error); }
};

module.exports = { createContact, getContacts, markAsRead, deleteContact, getUnreadCount };
