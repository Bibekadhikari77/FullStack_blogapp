const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Post category is required']
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  },
  seoTitle: {
    type: String,
    maxlength: [70, 'SEO title cannot exceed 70 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: 'text', content: 'text' });

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    }) + '-' + Date.now();
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
  }
  
  next();
});

module.exports = mongoose.model('Post', postSchema);
