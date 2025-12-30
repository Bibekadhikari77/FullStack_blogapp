const Post = require('../models/Post');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const View = require('../models/View');

// @desc    Get all posts with filtering and pagination
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      status, 
      author,
      search 
    } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Filter by status (only show published posts to non-authors)
    if (status) {
      query.status = status;
    } else if (!req.user || (req.user.role !== 'author' && req.user.role !== 'admin')) {
      query.status = 'published';
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug description')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user can view draft posts
    if (post.status === 'draft') {
      if (!req.user || (req.user._id.toString() !== post.author._id.toString() && req.user.role !== 'admin')) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this post'
        });
      }
    }

    // Increment view count only once per unique visitor
    // Use user ID if logged in, otherwise use IP address
    const identifier = req.user ? req.user._id.toString() : req.ip || req.connection.remoteAddress;
    
    try {
      // Try to create a new view record
      await View.create({
        post: post._id,
        identifier: identifier
      });
      
      // If successful, increment the view count
      post.views += 1;
      await post.save();
    } catch (error) {
      // If error is duplicate key (view already exists), do nothing
      // This means the user has already viewed this post
      if (error.code !== 11000) {
        // If it's a different error, log it but don't fail the request
        console.error('Error tracking view:', error);
      }
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/id/:id
// @access  Private (Author, Admin)
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug description')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (post.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this post'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Author, Admin)
exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      featuredImage,
      seoTitle,
      seoDescription
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Verify tags exist
    if (tags && tags.length > 0) {
      const tagsExist = await Tag.find({ _id: { $in: tags } });
      if (tagsExist.length !== tags.length) {
        return res.status(404).json({
          success: false,
          message: 'One or more tags not found'
        });
      }
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      status: status || 'draft',
      featuredImage,
      seoTitle,
      seoDescription,
      author: req.user._id
    });

    // Populate fields
    await post.populate('author', 'name email avatar');
    await post.populate('category', 'name slug');
    await post.populate('tags', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author/Admin)
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // Verify category if provided
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Verify tags if provided
    if (req.body.tags && req.body.tags.length > 0) {
      const tagsExist = await Tag.find({ _id: { $in: req.body.tags } });
      if (tagsExist.length !== req.body.tags.length) {
        return res.status(404).json({
          success: false,
          message: 'One or more tags not found'
        });
      }
    }

    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author/Admin)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization - only admin or post author
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by logged in user
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { author: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI content for post
// @route   POST /api/posts/generate-content
// @access  Private (Author, Admin)
exports.generateAIContent = async (req, res, next) => {
  try {
    const { title, excerpt, category } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required to generate content'
      });
    }

    // Generate structured content based on the title and category
    const generateContent = (title, excerpt, category) => {
      const categoryContext = category ? ` in the context of ${category}` : '';
      const introContext = category ? `This article explores ${title.toLowerCase()}${categoryContext}.` : `This comprehensive guide will explore ${title.toLowerCase()}.`;
      
      const sections = [
        {
          heading: 'Introduction',
          content: `${introContext} ${excerpt || 'We\'ll dive deep into the key aspects and provide valuable insights that will help you understand this topic better.'}`
        },
        {
          heading: 'Understanding the Basics',
          content: `Before diving deep into ${title.toLowerCase()}, it's essential to understand the fundamental concepts${categoryContext}. This foundation will help you grasp the more advanced topics we'll cover later.\n\nKey aspects to consider:\n• Core principles and definitions\n• Historical context and evolution\n• Current trends and developments\n• Why this matters in today's world`
        },
        {
          heading: 'Key Points to Consider',
          content: `When exploring ${title.toLowerCase()}, there are several critical factors to keep in mind. These elements play a crucial role in achieving success and avoiding common pitfalls.\n\nImportant considerations:\n• Understanding the fundamentals and core concepts\n• Practical applications and real-world examples\n• Best practices and proven methodologies\n• Common mistakes to avoid\n• Tips for effective implementation`
        },
        {
          heading: 'Deep Dive',
          content: `Let's explore ${title.toLowerCase()} more thoroughly${categoryContext}. This topic has gained significant attention due to its practical applications and importance in the field.\n\nBy understanding the nuances and key principles, you'll be better equipped to apply these concepts effectively. The insights shared here are based on industry best practices and real-world experiences.\n\nWhen implementing these ideas, it's crucial to consider your specific context and needs. What works in one situation may need adjustment in another.`
        },
        {
          heading: 'Practical Examples and Use Cases',
          content: `Understanding theory is important, but seeing how ${title.toLowerCase()} works in practice brings everything together. Here are some practical examples and use cases:\n\n<strong>Example 1: Real-World Application</strong>\nThis demonstrates how the concepts can be applied in everyday scenarios, helping you understand the practical value and implementation process.\n\n<strong>Example 2: Advanced Implementation</strong>\nFor those looking to take things further, this example shows more sophisticated approaches and techniques that can deliver enhanced results.\n\n<strong>Common Use Cases:</strong>\n• Personal projects and initiatives\n• Professional environments and workflows\n• Educational purposes and learning\n• Scaling and optimization scenarios`
        },
        {
          heading: 'Best Practices and Recommendations',
          content: `To get the most out of ${title.toLowerCase()}, consider following these best practices and recommendations:\n\n<strong>1. Start with Solid Foundations</strong>\nEnsure you have a strong understanding of the basics before moving to advanced topics. This will save time and prevent mistakes later.\n\n<strong>2. Stay Current and Keep Learning</strong>\nThe field is constantly evolving. Stay updated with the latest developments, trends, and best practices through continuous learning.\n\n<strong>3. Practice Regularly</strong>\nTheory alone isn't enough. Regular practice helps reinforce concepts and improve your skills over time.\n\n<strong>4. Learn from Others</strong>\nSeek out case studies, success stories, and lessons learned from others' experiences. This can provide valuable insights and shortcuts.\n\n<strong>5. Experiment and Iterate</strong>\nDon't be afraid to try new approaches. Testing and iterating helps you find what works best for your specific situation.`
        },
        {
          heading: 'Common Challenges and Solutions',
          content: `While working with ${title.toLowerCase()}, you may encounter various challenges. Here are some common issues and how to address them:\n\n<strong>Challenge 1: Getting Started</strong>\nMany people struggle with taking the first step. Start small, set achievable goals, and build momentum gradually.\n\n<strong>Challenge 2: Maintaining Consistency</strong>\nConsistency is key to success. Create a routine, set reminders, and track your progress to stay on track.\n\n<strong>Challenge 3: Dealing with Complexity</strong>\nBreak down complex problems into smaller, manageable pieces. Focus on one aspect at a time to avoid overwhelm.`
        },
        {
          heading: 'Conclusion',
          content: `In conclusion, ${title.toLowerCase()} is a valuable topic that deserves careful consideration${categoryContext}. By following the guidelines and best practices outlined in this article, you'll be well-positioned to succeed.\n\nRemember that mastery takes time and practice. Be patient with yourself, stay committed to learning, and don't hesitate to seek help when needed. The journey may have its challenges, but the rewards are well worth the effort.\n\nWe hope this comprehensive guide has provided you with valuable insights and practical knowledge. Continue exploring, learning, and growing in your understanding of this important subject.`
        }
      ];

      // Format as HTML
      let htmlContent = '';
      sections.forEach(section => {
        htmlContent += `<h2>${section.heading}</h2>\n`;
        htmlContent += `<p>${section.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>\n\n`;
      });

      return htmlContent;
    };

    const generatedContent = generateContent(title, excerpt, category);

    res.status(200).json({
      success: true,
      content: generatedContent,
      message: 'Content generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get most viewed posts
// @route   GET /api/posts/most-viewed
// @access  Public
exports.getMostViewedPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const mostViewedPosts = await Post.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(limit)
      .select('title slug views likesCount')
      .populate('author', 'name')
      .populate('category', 'name')
      .lean();

    res.status(200).json({
      success: true,
      count: mostViewedPosts.length,
      posts: mostViewedPosts
    });
  } catch (error) {
    console.error('Error fetching most viewed posts:', error);
    next(error);
  }
};
