const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  moderateComment
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('postId').notEmpty().withMessage('Post ID is required')
];

// Public routes
router.get('/post/:postId', getCommentsByPost);

// Protected routes
router.use(protect);

router.post('/', commentValidation, validate, createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

// Admin routes
router.get('/', authorize('admin'), getAllComments);
router.put('/:id/moderate', authorize('admin'), moderateComment);

module.exports = router;
