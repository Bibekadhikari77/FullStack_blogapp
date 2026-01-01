import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaEye, FaHeart } from 'react-icons/fa';

export default function PostDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [hasViewedPost, setHasViewedPost] = useState(false);

  // Reset hasViewedPost when slug changes
  useEffect(() => {
    setHasViewedPost(false);
  }, [slug]);

  useEffect(() => {
    if (slug && !hasViewedPost) {
      fetchPost();
      setHasViewedPost(true);
    }
  }, [slug, hasViewedPost]);

  useEffect(() => {
    if (post) {
      fetchComments();
      if (isAuthenticated) {
        checkLikeStatus();
      }
      // Scroll to comments if hash is present
      if (router.asPath.includes('#comments')) {
        setTimeout(() => {
          const element = document.getElementById('comments-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [post?._id, isAuthenticated, router.asPath]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${slug}`);
      setPost(response.data.post);
    } catch (error: any) {
      toast.error('Failed to load post');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!post?._id) return;
    try {
      const response = await api.get(`/comments/post/${post._id}`);
      setComments(response.data.comments);
    } catch (error) {
      // Comments loading failed silently
    }
  };

  const checkLikeStatus = async () => {
    if (!post?._id) return;
    try {
      const response = await api.get(`/likes/${post._id}/check`);
      setLiked(response.data.liked);
    } catch (error) {
      // Like status check failed silently
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      if (liked) {
        await api.delete(`/likes/${post._id}`);
        setLiked(false);
        setPost({ ...post, likesCount: post.likesCount - 1 });
        toast.success('Post unliked');
      } else {
        await api.post(`/likes/${post._id}`);
        setLiked(true);
        setPost({ ...post, likesCount: post.likesCount + 1 });
        toast.success('Post liked!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update like');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    try {
      await api.post('/comments', {
        content: commentText,
        postId: post._id,
        parentCommentId: replyTo
      });
      setCommentText('');
      setReplyTo(null);
      await fetchComments();
      // Update comment count
      setPost({ ...post, commentsCount: post.commentsCount + 1 });
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      await fetchComments();
      // Refetch post to get updated comment count
      await fetchPost();
      toast.success('Comment deleted');
    } catch (error: any) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      <Head>
        <title>{post.title} - BlogPlatform</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Link
              href={`/category/${post.category.slug}`}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              {post.category.name}
            </Link>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: any) => (
                <Link
                  key={tag._id}
                  href={`/tag/${tag.slug}`}
                  className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-y border-gray-200 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">{post.author.bio}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-500">
              <span className="flex items-center">
                <FaEye className="w-5 h-5 mr-1" />
                {post.views}
              </span>
              <button
                onClick={handleLike}
                className={`flex items-center ${liked ? 'text-red-500' : ''}`}
              >
                <FaHeart className="w-5 h-5 mr-1" fill={liked ? 'currentColor' : 'none'} />
                {post.likesCount}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        <section id="comments-section" className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">
            Comments ({post.commentsCount})
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                required
              />
              <div className="flex justify-between items-center mt-2">
                {replyTo && (
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel reply
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <p className="mb-8 text-gray-600">
              <Link href="/login" className="text-primary-600 hover:text-primary-700">
                Login
              </Link>{' '}
              to leave a comment
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{comment.author.name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                          {comment.isEdited && ' (edited)'}
                        </p>
                      </div>
                      {user?._id === comment.author._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                    <button
                      onClick={() => setReplyTo(comment._id)}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      Reply
                    </button>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                        {comment.replies.map((reply: any) => (
                          <div key={reply._id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                              {reply.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{reply.author.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(reply.createdAt), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                                {user?._id === reply.author._id && (
                                  <button
                                    onClick={() => handleDeleteComment(reply._id)}
                                    className="text-red-600 hover:text-red-700 text-xs"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
