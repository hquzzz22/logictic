const Shipment = require('../models/Shipment');

// Public tracking API
exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const shipment = await Shipment.findOne({ trackingNumber: trackingNumber.toUpperCase() });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Không tìm thấy vận đơn với mã này' });
    }
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tra cứu vận đơn', error: error.message });
  }
};

// Admin CRUD APIs
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách vận đơn', error: error.message });
  }
};

exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Không tìm thấy vận đơn' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const { trackingNumber, shipper, consignee, origin, destination, status, timeline } = req.body;
    
    const existing = await Shipment.findOne({ trackingNumber: trackingNumber.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Mã vận đơn đã tồn tại' });
    }

    const newShipment = new Shipment({
      trackingNumber,
      shipper,
      consignee,
      origin,
      destination,
      status,
      timeline: timeline || []
    });

    await newShipment.save();
    res.status(201).json(newShipment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo vận đơn', error: error.message });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!shipment) return res.status(404).json({ message: 'Không tìm thấy vận đơn' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật vận đơn', error: error.message });
  }
};

exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Không tìm thấy vận đơn' });
    res.json({ message: 'Đã xóa vận đơn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa vận đơn', error: error.message });
  }
};

exports.addTimelineEvent = async (req, res) => {
  try {
    const { description, location, timestamp } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    
    if (!shipment) return res.status(404).json({ message: 'Không tìm thấy vận đơn' });
    
    shipment.timeline.push({ description, location, timestamp: timestamp || Date.now() });
    await shipment.save();
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm sự kiện', error: error.message });
  }
};
