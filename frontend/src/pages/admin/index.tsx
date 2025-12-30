import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || !isAdmin) {
      toast.error('Access denied - Admin only');
      router.push('/');
      return;
    }
    fetchStats();
  }, [isAuthenticated, isAdmin, authLoading]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - BlogPlatform</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalPosts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalComments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalCategories}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-6 py-4 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Popular Posts
                </button>
                <button
                  onClick={() => setActiveTab('authors')}
                  className={`px-6 py-4 border-b-2 font-medium text-sm ${
                    activeTab === 'authors'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Top Authors
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Users by Role</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {stats?.usersByRole.map((item: any) => (
                        <div key={item._id} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 capitalize">{item._id}</p>
                          <p className="text-2xl font-bold">{item.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Posts</h3>
                    <div className="space-y-2">
                      {stats?.recentPosts.slice(0, 5).map((post: any) => (
                        <div key={post._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-gray-500">by {post.author.name}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Most Liked Posts</h3>
                  <div className="space-y-3">
                    {stats?.mostLikedPosts.map((post: any, index: number) => (
                      <div key={post._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-gray-500">by {post.author.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">❤️ {post.likesCount}</p>
                          <p className="text-xs text-gray-500">👁 {post.views}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'authors' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Most Active Authors</h3>
                  <div className="space-y-3">
                    {stats?.mostActiveAuthors.map((author: any, index: number) => (
                      <div key={author._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl">
                          {author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{author.name}</p>
                          <p className="text-sm text-gray-500">{author.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">{author.postCount}</p>
                          <p className="text-xs text-gray-500">posts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
