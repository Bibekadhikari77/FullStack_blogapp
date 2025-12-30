const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Public
exports.getPlatformStats = async (req, res) => {
  try {
    // Count active writers (users with author or admin role who have at least one post)
    const authorsWithPosts = await Post.distinct('author');
    const activeWriters = authorsWithPosts.length;

    // Count published posts
    const publishedPosts = await Post.countDocuments({ status: 'published' });

    // Calculate monthly readers (total views from all posts)
    const viewsResult = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const monthlyReaders = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // Additional stats
    const totalUsers = await User.countDocuments();
    const totalComments = await Post.aggregate([
      { $group: { _id: null, totalComments: { $sum: '$commentsCount' } } }
    ]);
    const commentsCount = totalComments.length > 0 ? totalComments[0].totalComments : 0;

    res.json({
      success: true,
      stats: {
        activeWriters,
        publishedPosts,
        monthlyReaders,
        totalUsers,
        commentsCount
      }
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform statistics'
    });
  }
};
