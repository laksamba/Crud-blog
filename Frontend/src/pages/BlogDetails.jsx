import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deletBlog, getBlogId, getCommentsById, postCommet } from '../Api/internal';
import CommentList from '../components/CommentList';
import Loader from '../components/Loader';

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;
  const username = useSelector(state => state.user.username);
  const userId = useSelector(state => state.user._id);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const [blogResponse, commentResponse] = await Promise.all([
          getBlogId(blogId),
          getCommentsById(blogId)
        ]);

        if (blogResponse.status === 200) {
          setBlog(blogResponse.data.post);
          setOwnsBlog(username === blogResponse.data.post.authorUsername);
        } else {
          setError('Failed to fetch blog details.');
        }

        if (commentResponse.status === 200) {
          setComments(commentResponse.data.data);
        } else {
          setError('Failed to fetch comments.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId, username, reload]);

  const postCommentHandler = async () => {
    try {
      const data = {
        author: userId,
        post: blogId,
        content: newComment
      };
      const response = await postCommet(data);
      if (response.status === 201) {
        setNewComment('');
        setReload(!reload);
      } else {
        setError('Failed to post comment.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  const deleteBlogHandler = async () => {
    try {
      const response = await deletBlog(blogId);
      if (response.status === 200) {
        navigate('/blog');
      } else {
        setError('Failed to delete blog.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <Loader text="Loading blog details..." />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!blog) {
    return <div className='flexCenter flex-col gap-5 h-1/6 pt-44'>Blog not found.</div>;
  }

  return (
    <section className='max_padd_container flex items-start justify-center flex-col gap-8 pt-32 md:flex-row'>
      <div className='flex flex-1 flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 transition-all duration-300 overflow-hidden cursor-default rounded-3xl'>
        <h4 className='bold-20 capitalize'>{blog.title}</h4>
        <div className='my-3'>
          <p className='bold-16 text-gray-700'>@{blog.authorUsername}</p>
          <p>{" on " + new Date(blog.createdAt).toDateString()}</p>
        </div>
        <div>
          <img src={blog.photo} alt="Blog" className='mb-6 rounded-3xl' />
        </div>
        <p>{blog.content}</p>
        {ownsBlog && (
          <div className='flexStart gap-2 my-6'>
            <button onClick={() => navigate(`/blog-update/${blog._id}`)} className='btn_secondary_rounded'>Edit</button>
            <button onClick={deleteBlogHandler} className='btn_red_rounded'>Delete</button>
          </div>
        )}
      </div>

      <div className='flex-1'>
        <CommentList comments={comments} />
        <div className='flexCenter gap-x-3'>
          <input
            type='text'
            placeholder='Comment here'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className='regular-14 py-3 px-5 my-2 bg-[#bcb9b9] rounded-full shadow-sm z-10'
          />
          <button onClick={postCommentHandler} className='btn_dark_rounded'>Post</button>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
