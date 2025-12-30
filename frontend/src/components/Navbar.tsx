import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAuthor, isAdmin } = useAuth();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 shadow-lg border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Logo" width={60} height={60} className="w-16 h-16" />
            </Link>
          </div>

          <div className="hidden md:flex md:space-x-12">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 text-base font-medium ${
                router.pathname === '/' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`inline-flex items-center px-1 pt-1 text-base font-medium ${
                router.pathname === '/categories' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={`inline-flex items-center px-1 pt-1 text-base font-medium ${
                router.pathname === '/about' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAuthor && (
                  <Link
                    href="/posts/create"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-md text-base font-medium hover:from-blue-700 hover:to-blue-800 transition-colors shadow-sm"
                  >
                    Create Post
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-base font-medium">{user?.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-base text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </div>
                    </Link>
                    <Link
                      href="/my-posts"
                      className="block px-4 py-2 text-base text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>My Posts</span>
                      </div>
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-md text-base font-medium hover:from-amber-700 hover:to-orange-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
