const Setting = require('../models/Setting');

// GET /api/settings/:key
const getSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (setting) {
      res.json(setting.value);
    } else {
      res.json(null);
    }
  } catch (error) { next(error); }
};

// GET /api/settings (all)
const getAllSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({});
    const obj = {};
    settings.forEach((s) => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (error) { next(error); }
};

// PUT /api/settings/:key
const updateSetting = async (req, res, next) => {
  try {
    const { value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (error) { next(error); }
};

module.exports = { getSetting, getAllSettings, updateSetting };
