import Head from 'next/head';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaPen, FaUsers, FaTags, FaShieldAlt, FaArrowRight, FaInfoCircle, FaRocket } from 'react-icons/fa';

interface PlatformStats {
  activeWriters: number;
  publishedPosts: number;
  monthlyReaders: number;
  totalUsers: number;
  commentsCount: number;
}

export default function About() {
  const [stats, setStats] = useState<PlatformStats>({
    activeWriters: 0,
    publishedPosts: 0,
    monthlyReaders: 0,
    totalUsers: 0,
    commentsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stats');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load platform statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toString();
  };

  return (
    <>
      <Head>
        <title>About Us - Blog Platform</title>
        <meta name="description" content="Learn more about our blogging platform and our mission" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <FaInfoCircle className="text-6xl md:text-7xl mr-4 animate-fadeIn" />
                <h1 className="text-5xl md:text-6xl font-bold animate-fadeIn">
                  About Our Platform
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-primary-100 animate-fadeIn animation-delay-200">
                Empowering writers to share their stories with the world
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Mission Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 hover-lift">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <FaRocket className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                We believe everyone has a story to tell. Our platform provides a beautiful, 
                intuitive space for writers to create, share, and connect with readers around the globe.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're a seasoned blogger or just starting your writing journey, 
                we're here to help you reach your audience and make an impact.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <FaPen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Rich Text Editor</h3>
                <p className="text-gray-600">
                  Create beautiful content with our powerful editor featuring formatting, 
                  images, and code syntax highlighting.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Community Driven</h3>
                <p className="text-gray-600">
                  Engage with readers through comments, likes, and shares. 
                  Build your audience and connect with fellow writers.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <FaTags className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Organization</h3>
                <p className="text-gray-600">
                  Organize your posts with categories and tags. 
                  Help readers discover your content easily.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <FaShieldAlt className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Secure & Reliable</h3>
                <p className="text-gray-600">
                  Your content is safe with us. We use industry-standard security 
                  practices to protect your data.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-8">
              <h2 className="text-3xl font-bold text-center mb-12">Platform Stats</h2>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold mb-2">{stats.activeWriters || 0}</div>
                    <div className="text-primary-100 text-lg">Active Writers</div>
                  </div>
                  <div className="transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold mb-2">{stats.publishedPosts || 0}</div>
                    <div className="text-primary-100 text-lg">Published Posts</div>
                  </div>
                  <div className="transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold mb-2">{formatNumber(stats.monthlyReaders || 0)}</div>
                    <div className="text-primary-100 text-lg">Total Views</div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Writing?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of writers who are already sharing their stories. 
                Create your account today and publish your first post in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  Get Started
                  <FaArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all"
                >
                  Explore Posts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
