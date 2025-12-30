const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Get top-level comments (no parent)
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment.find({ 
      post: postId, 
      parentComment: null,
      isApproved: true 
    })
      .populate('author', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ 
          parentComment: comment._id,
          isApproved: true 
        })
          .populate('author', 'name avatar')
          .sort('createdAt');
        
        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    const total = await Comment.countDocuments({ 
      post: postId, 
      parentComment: null,
      isApproved: true 
    });

    res.status(200).json({
      success: true,
      count: commentsWithReplies.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      comments: commentsWithReplies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // If reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null
    });

    // Update post comments count
    post.commentsCount += 1;
    await post.save();

    // Populate author
    await comment.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check authorization
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    await comment.populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check authorization - owner or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    // Update post comments count
    const post = await Post.findById(comment.post);
    if (post) {
      const deletedCount = await Comment.countDocuments({ 
        $or: [
          { _id: comment._id },
          { parentComment: comment._id }
        ]
      });
      post.commentsCount = Math.max(0, post.commentsCount - deletedCount);
      await post.save();
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments (Admin)
// @route   GET /api/comments
// @access  Private (Admin)
exports.getAllComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;

    const query = {};
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment.find(query)
      .populate('author', 'name email avatar')
      .populate('post', 'title slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject comment (Admin)
// @route   PUT /api/comments/:id/moderate
// @access  Private (Admin)
exports.moderateComment = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.isApproved = isApproved;
    await comment.save();

    res.status(200).json({
      success: true,
      message: `Comment ${isApproved ? 'approved' : 'rejected'} successfully`,
      comment
    });
  } catch (error) {
    next(error);
  }
};
