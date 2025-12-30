const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  getPopularTags
} = require('../controllers/tagController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const tagValidation = [
  body('name').trim().notEmpty().withMessage('Tag name is required')
];

// Public routes
router.get('/', getTags);
router.get('/popular', getPopularTags);
router.get('/:slug', getTag);

// Protected routes
router.use(protect);

router.post('/', authorize('author', 'admin'), tagValidation, validate, createTag);
router.put('/:id', authorize('admin'), updateTag);
router.delete('/:id', authorize('admin'), deleteTag);

module.exports = router;
