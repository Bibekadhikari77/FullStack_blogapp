# 📚 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "reader" // optional: "reader", "author"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reader"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reader"
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reader",
    "bio": "Software developer"
  }
}
```

---

## 📝 Posts Endpoints

### Get All Posts
**GET** `/posts`

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `category` (string) - Filter by category ID
- `tag` (string) - Filter by tag ID
- `search` (string) - Search in title and content
- `status` (string) - Filter by status ("draft" or "published")

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "posts": [
    {
      "_id": "post-id",
      "title": "My First Post",
      "slug": "my-first-post-123456",
      "excerpt": "This is a brief description",
      "content": "<p>Full content here</p>",
      "author": {
        "_id": "author-id",
        "name": "John Doe",
        "avatar": ""
      },
      "category": {
        "_id": "category-id",
        "name": "Technology",
        "slug": "technology"
      },
      "tags": [
        {
          "_id": "tag-id",
          "name": "javascript",
          "slug": "javascript"
        }
      ],
      "status": "published",
      "views": 150,
      "likesCount": 25,
      "commentsCount": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

### Get Single Post
**GET** `/posts/:slug`

**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "post-id",
    "title": "My First Post",
    "slug": "my-first-post-123456",
    "content": "<p>Full content here</p>",
    "author": {
      "_id": "author-id",
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Developer"
    },
    "category": {
      "_id": "category-id",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech posts"
    },
    "tags": [...],
    "views": 150,
    "likesCount": 25,
    "commentsCount": 10
  }
}
```

### Create Post
**POST** `/posts`

**Headers:** Authorization required (Author/Admin)

**Body:**
```json
{
  "title": "My New Post",
  "content": "<p>Post content in HTML</p>",
  "excerpt": "Brief description",
  "category": "category-id",
  "tags": ["tag-id-1", "tag-id-2"],
  "status": "published", // or "draft"
  "featuredImage": "https://example.com/image.jpg",
  "seoTitle": "SEO friendly title",
  "seoDescription": "SEO description"
}
```

### Update Post
**PUT** `/posts/:id`

**Headers:** Authorization required (Author/Admin - own posts only)

**Body:** Same as Create Post (all fields optional)

### Delete Post
**DELETE** `/posts/:id`

**Headers:** Authorization required (Author/Admin - own posts or admin)

---

## 🏷️ Categories Endpoints

### Get All Categories
**GET** `/categories`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "categories": [
    {
      "_id": "category-id",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech related posts",
      "createdBy": {
        "_id": "user-id",
        "name": "Admin"
      }
    }
  ]
}
```

### Create Category
**POST** `/categories`

**Headers:** Authorization required (Admin only)

**Body:**
```json
{
  "name": "Technology",
  "description": "Tech related posts"
}
```

---

## 🔖 Tags Endpoints

### Get All Tags
**GET** `/tags`

### Get Popular Tags
**GET** `/tags/popular`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "tags": [
    {
      "_id": "tag-id",
      "name": "javascript",
      "slug": "javascript",
      "count": 25
    }
  ]
}
```

### Create Tag
**POST** `/tags`

**Headers:** Authorization required (Author/Admin)

**Body:**
```json
{
  "name": "javascript"
}
```

---

## 💬 Comments Endpoints

### Get Post Comments
**GET** `/comments/post/:postId`

**Query Parameters:**
- `page` (number)
- `limit` (number)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "comments": [
    {
      "_id": "comment-id",
      "content": "Great post!",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": ""
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isEdited": false,
      "replies": [
        {
          "_id": "reply-id",
          "content": "Thanks!",
          "author": {...}
        }
      ]
    }
  ]
}
```

### Create Comment
**POST** `/comments`

**Headers:** Authorization required

**Body:**
```json
{
  "content": "Great post!",
  "postId": "post-id",
  "parentCommentId": "comment-id" // optional for replies
}
```

### Delete Comment
**DELETE** `/comments/:id`

**Headers:** Authorization required (Owner or Admin)

---

## ❤️ Likes Endpoints

### Like Post
**POST** `/likes/:postId`

**Headers:** Authorization required

### Unlike Post
**DELETE** `/likes/:postId`

**Headers:** Authorization required

### Check if Liked
**GET** `/likes/:postId/check`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "liked": true
}
```

---

## 👑 Admin Endpoints

### Get Dashboard Stats
**GET** `/admin/stats`

**Headers:** Authorization required (Admin only)

**Response:**
```json
{
  "success": true,
  "stats": {
    "overview": {
      "totalUsers": 100,
      "totalPosts": 250,
      "publishedPosts": 200,
      "draftPosts": 50,
      "totalComments": 500,
      "totalCategories": 10
    },
    "usersByRole": [
      { "_id": "reader", "count": 80 },
      { "_id": "author", "count": 15 },
      { "_id": "admin", "count": 5 }
    ],
    "mostLikedPosts": [...],
    "mostViewedPosts": [...],
    "mostActiveAuthors": [...]
  }
}
```

### Get All Users
**GET** `/admin/users`

**Headers:** Authorization required (Admin only)

**Query Parameters:**
- `page`, `limit`, `role`, `search`

### Update User Role
**PUT** `/admin/users/:id/role`

**Headers:** Authorization required (Admin only)

**Body:**
```json
{
  "role": "author" // "reader", "author", or "admin"
}
```

### Activate/Deactivate User
**PUT** `/admin/users/:id/status`

**Headers:** Authorization required (Admin only)

**Body:**
```json
{
  "isActive": false
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```
