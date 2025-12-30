import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: {
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
  };
  onLikeUpdate?: (postId: string, newCount: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLikeUpdate }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(post.likesCount);
  const [checkingLike, setCheckingLike] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkLikeStatus();
    }
  }, [isAuthenticated, post._id]);

  const checkLikeStatus = async () => {
    if (checkingLike) return;
    try {
      setCheckingLike(true);
      const response = await api.get(`/likes/${post._id}/check`);
      setLiked(response.data.liked);
    } catch (error) {
      // Silently fail if not authenticated
    } finally {
      setCheckingLike(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      router.push('/login');
      return;
    }

    try {
      if (liked) {
        await api.delete(`/likes/${post._id}`);
        setLiked(false);
        const newCount = Math.max(0, currentLikesCount - 1);
        setCurrentLikesCount(newCount);
        if (onLikeUpdate) onLikeUpdate(post._id, newCount);
        toast.success('Post unliked');
      } else {
        await api.post(`/likes/${post._id}`);
        setLiked(true);
        const newCount = currentLikesCount + 1;
        setCurrentLikesCount(newCount);
        if (onLikeUpdate) onLikeUpdate(post._id, newCount);
        toast.success('Post liked!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update like');
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/posts/${post.slug}#comments`);
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 border border-gray-100">
      <Link href={`/posts/${post.slug}`} className="relative block overflow-hidden">
        {post.featuredImage ? (
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
            </div>
            <svg className="relative w-20 h-20 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center space-x-2 mb-3 flex-wrap gap-y-2">
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 hover:from-primary-100 hover:to-purple-100 transition-all"
          >
            {post.category.name}
          </Link>
          <span className="text-gray-300">•</span>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {format(new Date(post.createdAt), 'MMM dd, yyyy')}
          </div>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 hover:text-primary-600 transition-colors line-clamp-2 leading-tight group-hover:text-primary-600">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:from-gray-100 hover:to-gray-200 transition-all font-medium"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-primary-100 ring-offset-2"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate max-w-[100px] sm:max-w-none">{post.author.name}</span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 sm:space-x-1.5 transition-all transform hover:scale-110 ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-semibold text-xs sm:text-sm">{currentLikesCount}</span>
            </button>
            
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 sm:space-x-1.5 text-gray-500 hover:text-primary-600 transition-all transform hover:scale-110"
              title="Comments"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="font-semibold text-xs sm:text-sm">{post.commentsCount || 0}</span>
            </button>
            
            <div className="flex items-center space-x-1 sm:space-x-1.5 text-gray-500" title="Views">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="font-semibold text-xs sm:text-sm">{post.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
