# Database Indexes for Performance Optimization

## Required Indexes

Add these indexes to your MongoDB database for optimal performance:

### Posts Collection
```javascript
// For finding published posts and sorting
db.posts.createIndex({ status: 1, createdAt: -1 });
db.posts.createIndex({ status: 1, views: -1 });
db.posts.createIndex({ status: 1, likesCount: -1 });

// For filtering by category/tags
db.posts.createIndex({ category: 1, status: 1 });
db.posts.createIndex({ tags: 1, status: 1 });

// For author's posts
db.posts.createIndex({ author: 1, createdAt: -1 });

// For slug lookup (unique)
db.posts.createIndex({ slug: 1 }, { unique: true });

// For text search
db.posts.createIndex({ title: "text", content: "text", excerpt: "text" });
```

### Users Collection
```javascript
// For authentication
db.users.createIndex({ email: 1 }, { unique: true });

// For role-based queries
db.users.createIndex({ role: 1 });
```

### Categories Collection
```javascript
// For unique slugs
db.categories.createIndex({ slug: 1 }, { unique: true });

// For alphabetical sorting
db.categories.createIndex({ name: 1 });
```

### Tags Collection
```javascript
// For unique slugs
db.tags.createIndex({ slug: 1 }, { unique: true });

// For alphabetical sorting
db.tags.createIndex({ name: 1 });
```

### Comments Collection
```javascript
// For finding comments by post
db.comments.createIndex({ post: 1, createdAt: -1 });

// For finding comments by author
db.comments.createIndex({ author: 1, createdAt: -1 });
```

### Likes Collection
```javascript
// For checking user likes (compound unique)
db.likes.createIndex({ user: 1, post: 1 }, { unique: true });

// For counting post likes
db.likes.createIndex({ post: 1 });
```

### Views Collection
```javascript
// For tracking user views
db.views.createIndex({ user: 1, post: 1 });
db.views.createIndex({ post: 1, viewedAt: -1 });
```

## How to Apply

Run these commands in MongoDB Shell or add them to your application startup:

```javascript
// In your server.js or a separate database setup file
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Posts indexes
    await db.collection('posts').createIndex({ status: 1, createdAt: -1 });
    await db.collection('posts').createIndex({ status: 1, views: -1 });
    await db.collection('posts').createIndex({ slug: 1 }, { unique: true });
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Categories indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    
    // Tags indexes
    await db.collection('tags').createIndex({ slug: 1 }, { unique: true });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Call after database connection
mongoose.connection.once('open', () => {
  createIndexes();
});
```

## Performance Benefits

- **Query Speed**: 10-100x faster queries on indexed fields
- **Reduced Load**: Less CPU and memory usage
- **Better Scalability**: Handles more concurrent requests
- **Improved UX**: Faster page loads and search results
