import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import { FaStar, FaSearch } from 'react-icons/fa';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  createdAt: string;
  views: number;
  likesCount: number;
  commentsCount: number;
}

interface MostViewedPost {
  _id: string;
  title: string;
  slug: string;
  views: number;
  likesCount: number;
  createdAt: string;
  author: {
    name: string;
  };
  category: {
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
  count?: number;
}

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [mostViewedPosts, setMostViewedPosts] = useState<MostViewedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreViewedPosts, setShowMoreViewedPosts] = useState(false);

  // Initialize from URL query parameters
  useEffect(() => {
    if (router.isReady) {
      const { category, tag, search: searchQuery, page } = router.query;
      if (category && typeof category === 'string') setSelectedCategory(category);
      if (tag && typeof tag === 'string') setSelectedTag(tag);
      if (searchQuery && typeof searchQuery === 'string') setSearch(searchQuery);
      if (page && typeof page === 'string') setCurrentPage(parseInt(page));
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchPopularTags();
  }, [currentPage, selectedCategory, selectedTag]);

  useEffect(() => {
    fetchMostViewedPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: 9 };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedTag) params.tag = selectedTag;
      if (search) params.search = search;

      const response = await api.get('/posts', { params });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      // Categories loading failed silently
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await api.get('/tags/popular');
      setPopularTags(response.data.tags || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Tags loading failed silently
    }
  };

  const fetchMostViewedPosts = async () => {
    try {
      const response = await api.get('/posts/most-viewed', { params: { limit: 10 } });
      setMostViewedPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching most viewed posts:', error);
    }
  };

  // Memoize visible categories to prevent unnecessary recalculations
  const visibleCategories = useMemo(() => {
    return showMoreCategories ? categories : categories.slice(0, 6);
  }, [categories, showMoreCategories]);

  const hiddenCategoriesCount = useMemo(() => {
    return Math.max(0, categories.length - 6);
  }, [categories.length]);

  // Memoize visible most viewed posts
  const visibleMostViewedPosts = useMemo(() => {
    return showMoreViewedPosts ? mostViewedPosts : mostViewedPosts.slice(0, 6);
  }, [mostViewedPosts, showMoreViewedPosts]);

  const hiddenViewedPostsCount = useMemo(() => {
    return Math.max(0, mostViewedPosts.length - 6);
  }, [mostViewedPosts.length]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  }, [fetchPosts]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTag('');
    setCurrentPage(1);
    // Update URL
    router.push({
      pathname: '/',
      query: categoryId ? { category: categoryId } : {}
    }, undefined, { shallow: true });
  }, [router]);

  const handleTagChange = useCallback((tagId: string) => {
    setSelectedTag(tagId);
    setSelectedCategory('');
    setCurrentPage(1);
    // Update URL
    router.push({
      pathname: '/',
      query: tagId ? { tag: tagId } : {}
    }, undefined, { shallow: true });
  }, [router]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearch('');
    setCurrentPage(1);
    router.push('/', undefined, { shallow: true });
  }, [router]);

  return (
    <>
      <Head>
        <title>BlogPlatform - Share Your Ideas</title>
        <meta name="description" content="A modern blogging platform to share your thoughts and ideas" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 text-white py-24 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/5 rounded-full filter blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                <FaStar className="w-4 h-4 mr-2" />
                Trusted by thousands of writers
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight animate-fadeIn px-4">
              Welcome to <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">BlogPlatform</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed animate-slideInRight px-4">
              Discover stories, thinking, and expertise from writers on any topic. Share your voice with the world.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4">
              <div className="relative flex flex-col sm:flex-row items-stretch group gap-2 sm:gap-0">
                <div className="absolute left-8 sm:left-4 top-1/2 sm:top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none z-10">
                  <FaSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts..."
                  className="flex-1 pl-14 pr-4 py-3 sm:py-4 text-gray-900 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-md text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaSearch className="w-5 h-5" />
                  <span className="sm:inline">Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex items-center mb-4">

                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      !selectedCategory 
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md' 
                        : 'hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {visibleCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category._id)}
                      className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedCategory === category._id 
                          ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md' 
                          : 'hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                  {hiddenCategoriesCount > 0 && (
                    <button
                      onClick={() => setShowMoreCategories(!showMoreCategories)}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors duration-200 mt-3"
                    >
                      {showMoreCategories ? 'Show Less' : `See More (${hiddenCategoriesCount})`}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Most Viewed</h3>
                </div>
                <div className="space-y-3">
                  {mostViewedPosts.length > 0 ? (
                    <>
                      {visibleMostViewedPosts.map((post, index) => (
                        <Link
                          key={post._id}
                          href={`/posts/${post.slug}`}
                          className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 transition-all duration-200 group border border-transparent hover:border-primary-100"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                {post.title}
                              </h4>
                              <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                                <span className="flex items-center space-x-1">
                                  <span>👁</span>
                                  <span className="font-medium">{post.views}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <span>❤️</span>
                                  <span className="font-medium">{post.likesCount}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {hiddenViewedPostsCount > 0 && (
                        <button
                          onClick={() => setShowMoreViewedPosts(!showMoreViewedPosts)}
                          className="block w-full text-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors duration-200 mt-3"
                        >
                          {showMoreViewedPosts ? 'Show Less' : `See More (${hiddenViewedPostsCount})`}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No posts available</p>
                  )}
                </div>
              </div>
            </aside>

            {/* Posts Grid */}
            <div className="flex-1">
              {/* Active Filters */}
              {(selectedCategory || selectedTag || search) && (
                <div className="mb-6 flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Category: {categories.find(c => c._id === selectedCategory)?.name}
                      <button
                        onClick={() => handleCategoryChange('')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Tag: {popularTags.find(t => t._id === selectedTag)?.name}
                      <button
                        onClick={() => handleTagChange('')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Search: "{search}"
                      <button
                        onClick={() => { setSearch(''); setCurrentPage(1); }}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
                      <div className="h-40 sm:h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No posts found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
