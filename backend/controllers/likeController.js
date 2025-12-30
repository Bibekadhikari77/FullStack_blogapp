const Like = require('../models/Like');
const Post = require('../models/Post');

// @desc    Like a post
// @route   POST /api/likes/:postId
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({
      post: postId,
      user: req.user._id
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this post'
      });
    }

    // Create like
    const like = await Like.create({
      post: postId,
      user: req.user._id
    });

    // Update post likes count
    post.likesCount += 1;
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post liked successfully',
      like
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this post'
      });
    }
    next(error);
  }
};

// @desc    Unlike a post
// @route   DELETE /api/likes/:postId
// @access  Private
exports.unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Find and delete like
    const like = await Like.findOneAndDelete({
      post: postId,
      user: req.user._id
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: 'Like not found'
      });
    }

    // Update post likes count
    const post = await Post.findById(postId);
    if (post) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user liked a post
// @route   GET /api/likes/:postId/check
// @access  Private
exports.checkLike = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const like = await Like.findOne({
      post: postId,
      user: req.user._id
    });

    res.status(200).json({
      success: true,
      liked: !!like
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users who liked a post
// @route   GET /api/likes/:postId/users
// @access  Public
exports.getPostLikes = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const likes = await Like.find({ post: postId })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Like.countDocuments({ post: postId });

    res.status(200).json({
      success: true,
      count: likes.length,
      total,
      likes
    });
  } catch (error) {
    next(error);
  }
};
