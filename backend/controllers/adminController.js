const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'published' });
    const draftPosts = await Post.countDocuments({ status: 'draft' });
    const totalComments = await Comment.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get user statistics by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get most liked posts
    const mostLikedPosts = await Post.find({ status: 'published' })
      .sort('-likesCount')
      .limit(5)
      .populate('author', 'name')
      .populate('category', 'name')
      .select('title slug likesCount views createdAt')
      .lean();

    // Get most viewed posts
    const mostViewedPosts = await Post.find({ status: 'published' })
      .sort('-views')
      .limit(5)
      .populate('author', 'name')
      .populate('category', 'name')
      .select('title slug views likesCount createdAt')
      .lean();

    // Get most active authors
    const mostActiveAuthors = await Post.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$author',
          postCount: { $sum: 1 }
        }
      },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      { $unwind: '$authorInfo' },
      {
        $project: {
          _id: '$authorInfo._id',
          name: '$authorInfo.name',
          email: '$authorInfo.email',
          avatar: '$authorInfo.avatar',
          postCount: 1
        }
      }
    ]);

    // Get recent posts
    const recentPosts = await Post.find()
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'name')
      .populate('category', 'name')
      .select('title slug status createdAt')
      .lean();

    // Get recent comments
    const recentComments = await Comment.find()
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'name')
      .populate('post', 'title slug')
      .lean();

    // Posts created over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const postsOverTime = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        overview: {
          totalUsers,
          totalPosts,
          publishedPosts,
          draftPosts,
          totalComments,
          totalCategories
        },
        usersByRole,
        mostLikedPosts,
        mostViewedPosts,
        mostActiveAuthors,
        recentPosts,
        recentComments,
        postsOverTime
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['reader', 'author', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/Activate user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
