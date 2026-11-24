const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Vui lòng nhập email và mật khẩu');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Email hoặc mật khẩu không hợp lệ');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Email không hợp lệ');
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      res.status(400);
      throw new Error('Email này đã được đăng ký');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Dữ liệu không hợp lệ');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('Không tìm thấy người dùng');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        if (req.body.password.length < 6) {
          res.status(400);
          throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('Không tìm thấy người dùng');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create user (Admin)
// @route   POST /api/users/admin
// @access  Private/Admin
const createUserByAdmin = async (req, res, next) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Vui lòng nhập đầy đủ họ tên, email và mật khẩu');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      res.status(400);
      throw new Error('Email không hợp lệ');
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400);
      throw new Error('Email này đã tồn tại trong hệ thống');
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      isAdmin: Boolean(isAdmin),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user info / role / password (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('Không tìm thấy người dùng');
    }

    const isSelf = String(req.user._id) === String(user._id);

    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      user.name = req.body.name.trim();
    }

    if (typeof req.body.email === 'string' && req.body.email.trim()) {
      const normalizedEmail = req.body.email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        res.status(400);
        throw new Error('Email không hợp lệ');
      }
      const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (duplicate) {
        res.status(400);
        throw new Error('Email này đã được sử dụng bởi tài khoản khác');
      }
      user.email = normalizedEmail;
    }

    if (typeof req.body.isAdmin === 'boolean' && req.body.isAdmin !== user.isAdmin) {
      if (!req.body.isAdmin) {
        if (isSelf) {
          res.status(400);
          throw new Error('Không thể tự gỡ quyền Admin của tài khoản đang đăng nhập');
        }
        const adminCount = await User.countDocuments({ isAdmin: true });
        if (adminCount <= 1) {
          res.status(400);
          throw new Error('Hệ thống phải có ít nhất 1 tài khoản Admin');
        }
      }
      user.isAdmin = req.body.isAdmin;
    }

    if (typeof req.body.password === 'string' && req.body.password.length > 0) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (String(req.user._id) === String(user._id)) {
        res.status(400);
        throw new Error('Không thể tự xóa tài khoản đang đăng nhập');
      }
      if (user.isAdmin) {
        const adminCount = await User.countDocuments({ isAdmin: true });
        if (adminCount <= 1) {
          res.status(400);
          throw new Error('Phải giữ lại ít nhất 1 tài khoản Admin');
        }
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Đã xóa người dùng' });
    } else {
      res.status(404);
      throw new Error('Không tìm thấy người dùng');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUser,
};
