const express = require('express');
const router = express.Router();
const {
  likePost,
  unlikePost,
  checkLike,
  getPostLikes
} = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/:postId/users', getPostLikes);

// Protected routes
router.use(protect);

router.post('/:postId', likePost);
router.delete('/:postId', unlikePost);
router.get('/:postId/check', checkLike);

module.exports = router;
