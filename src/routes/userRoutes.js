const { Router } = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Op } = require('sequelize');
const authController = require('../controllers/authController');
const authService = require('../services/authService');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRole');
const { ValidationError } = require('../utils/errors');
const db = require('../models');
const { User, Student, Faculty, Department } = db;

const router = Router();

router.get('/me', authenticate, authController.getProfile);

router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    if (fullName) {
      req.user.fullName = fullName;
      await req.user.save();
    }
    if (phone) {
      req.user.phone = phone;
      await req.user.save();
    }

    const profile = await authService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.post('/me/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current and new password are required');
    }

    const isValid = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!isValid) {
      throw new ValidationError('Current password is incorrect');
    }

    req.user.passwordHash = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

const uploadDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// MIME tipine göre dosya uzantısını belirleyen yardımcı fonksiyon
const getFileExtension = (mimetype) => {
  switch (mimetype) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      return ''; 
  }
};


const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      return cb(new ValidationError('Only jpg and png files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/me/profile-picture', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('File is required');
    }

    // 1. Dosya uzantısını belirle ve dosyayı yeniden adlandır
    const oldPath = req.file.path;
    const extension = getFileExtension(req.file.mimetype);
    const newFilename = req.file.filename + extension;
    const newPath = path.join(uploadDir, newFilename);

    // Dosyayı uzantısıyla birlikte yeniden adlandır
    fs.renameSync(oldPath, newPath);

    // 2. Eğer daha önce bir profil fotoğrafı varsa, diskten sil
    if (req.user.profilePictureUrl) {
      const oldFilename = req.user.profilePictureUrl.split('/').pop();
      const oldFilePath = path.join(uploadDir, oldFilename);
      
      // Dosyanın varlığını kontrol et ve sil (yeni dosya adıyla aynı olmadığından emin ol)
      if (fs.existsSync(oldFilePath) && oldFilename !== newFilename) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // 3. Veritabanı kaydını güncelle
    const relativePath = `/uploads/${newFilename}`;
    req.user.profilePictureUrl = relativePath;
    await req.user.save();

    res.json({ avatarUrl: relativePath });
  } catch (error) {
    // Hata durumunda yüklenen dosyayı silmek iyi bir uygulamadır
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); 
    }
    next(error);
  }
});

router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, department, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = {};
    if (role) where.role = role;
    if (search) {
      where.fullName = { [Op.iLike]: `%${search}%` };
    }

    const departmentFilter = department
      ? { where: { code: { [Op.iLike]: department } }, required: false }
      : {};

    const include = [
      { model: Student, include: [{ model: Department, ...departmentFilter }] },
      { model: Faculty, include: [{ model: Department, ...departmentFilter }] },
    ];

    const { count, rows } = await User.findAndCountAll({
      where,
      include,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      data: rows.map(authService.buildUserPayload),
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;