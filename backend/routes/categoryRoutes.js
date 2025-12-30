const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required')
];

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategory);

// Protected routes
router.use(protect);

// Authors and Admins can create categories
router.post('/', authorize('author', 'admin'), categoryValidation, validate, createCategory);

// Admin only routes
router.use(authorize('admin'));
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
