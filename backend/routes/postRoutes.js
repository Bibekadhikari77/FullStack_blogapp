const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getPosts,
  getPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  generateAIContent,
  getMostViewedPosts
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required')
];

// Public routes
router.get('/', getPosts);
router.get('/most-viewed', getMostViewedPosts);
router.get('/:slug', getPost);

// Protected routes
router.use(protect);

router.get('/id/:id', getPostById);
router.get('/user/my-posts', getMyPosts);
router.post('/generate-content', authorize('author', 'admin'), generateAIContent);
router.post('/', authorize('author', 'admin'), postValidation, validate, createPost);
router.put('/:id', authorize('author', 'admin'), updatePost);
router.delete('/:id', authorize('author', 'admin'), deletePost);

module.exports = router;
