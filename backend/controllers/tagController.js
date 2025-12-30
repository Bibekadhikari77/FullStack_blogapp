const Tag = require('../models/Tag');
const slugify = require('slugify');

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort('name');

    res.status(200).json({
      success: true,
      count: tags.length,
      tags
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tag
// @route   GET /api/tags/:slug
// @access  Public
exports.getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.status(200).json({
      success: true,
      tag
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create tag
// @route   POST /api/tags
// @access  Private (Author, Admin)
exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    const tag = await Tag.create({
      name: name.toLowerCase(),
      slug
    });

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      tag
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tag
// @route   PUT /api/tags/:id
// @access  Private (Admin only)
exports.updateTag = async (req, res, next) => {
  try {
    let tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Update slug if name changes
    if (req.body.name) {
      req.body.name = req.body.name.toLowerCase();
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      tag
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tag
// @route   DELETE /api/tags/:id
// @access  Private (Admin only)
exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    await tag.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular tags
// @route   GET /api/tags/popular
// @access  Public
exports.getPopularTags = async (req, res, next) => {
  try {
    const Post = require('../models/Post');
    
    // Get popular tags based on total views of posts using each tag
    const popularTags = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { 
        $group: { 
          _id: '$tags', 
          count: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ['$views', 0] } }
        } 
      },
      { $sort: { totalViews: -1, count: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tagInfo'
        }
      },
      { $unwind: '$tagInfo' },
      {
        $project: {
          _id: '$tagInfo._id',
          name: '$tagInfo.name',
          slug: '$tagInfo.slug',
          count: 1,
          totalViews: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: popularTags.length,
      tags: popularTags
    });
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    next(error);
  }
};
