import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function MyPosts() {
  const router = useRouter();
  const { isAuthor, isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || !isAuthor) {
      toast.error('Access denied. You must be an author to view this page.');
      router.push('/');
      return;
    }
    fetchMyPosts();
  }, [isAuthenticated, isAuthor, authLoading, filter]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await api.get('/posts/user/my-posts', { params });
      setPosts(response.data.posts);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      toast.success('Post deleted successfully');
      fetchMyPosts();
    } catch (error: any) {
      toast.error('Failed to delete post');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Posts - BlogPlatform</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Posts</h1>
          <Link
            href="/posts/create"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Create New Post
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'published'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'draft'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li key={post._id}>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link href={`/posts/${post.slug}`} className="block">
                          <h3 className="text-lg font-medium text-gray-900 truncate hover:text-primary-600">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status}
                          </span>
                          <span className="ml-4">{post.category.name}</span>
                          <span className="ml-4">{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                          <span>👁 {post.views} views</span>
                          <span>❤️ {post.likesCount} likes</span>
                          <span>💬 {post.commentsCount} comments</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <Link
                          href={`/posts/edit/${post._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No posts found</p>
            <Link
              href="/posts/create"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
            >
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
