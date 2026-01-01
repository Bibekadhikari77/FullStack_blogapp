import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaSearch, FaFolder, FaArrowRight, FaChevronUp, FaChevronDown, FaArrowLeft } from 'react-icons/fa';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show only 6 categories initially, rest under "More" button
  const visibleCategories = showMore ? filteredCategories : filteredCategories.slice(0, 6);
  const hiddenCount = filteredCategories.length - 6;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Categories - BlogPlatform</title>
        <meta name="description" content="Browse all blog categories" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="text-4xl font-bold text-gray-900 mb-4">
            Explore our blog posts by category
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <FaSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FaFolder
              className="mx-auto h-12 w-12 text-gray-400"
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'No categories match your search.' : 'No categories have been created yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCategories.map((category) => (
              <Link
                key={category._id}
                href={`/?category=${category._id}`}
                  className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    {/* Category Icon/Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-700 flex items-center justify-center text-white text-3xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {category.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>

                    {/* Category Description */}
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {category.description}
                      </p>
                    )}

                  {/* View Posts Link */}
                  <div className="flex items-center text-primary-600 group-hover:text-purple-600 font-medium mt-auto">
                    <span>View Posts</span>
                    <FaArrowRight
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More Button */}
          {!searchQuery && hiddenCount > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowMore(!showMore)}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {showMore ? (
                  <>
                    <span>Show Less</span>
                    <FaChevronUp className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    <span>Show More ({hiddenCount})</span>
                    <FaChevronDown className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          )}
          </>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FaArrowLeft
              className="w-5 h-5 mr-2"
            />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
