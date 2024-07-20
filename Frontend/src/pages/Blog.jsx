import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { getAllblog } from '../Api/internal';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllblog();
        if (response.status === 200) {
          setBlogs(response.data.posts);
        } else {
          console.log("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) {
    return <Loader text="Loading blogs..." />;
  }

  if (blogs.length === 0) {
    return <div className='flexCenter flex-col gap-5 h-1/6 pt-44'>No blogs found.</div>;
  }

  return (
    <section className='max_padd_container flex flex-col justify-center pt-32'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {blogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => navigate(`/blog/${blog._id}`)}
            className='flex flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 rounded-3xl overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-300'
          >
            <img
              src={blog.photo}
              alt="Blog Post"
              className='block object-cover w-full rounded-2xl h-56 bg-white'
            />
            <h4 className='text-left mt-4 font-bold text-16 line-clamp-2 text-[#333]'>{blog.title}</h4>
            <p className='line-clamp-3 mt-2 text-left'>{blog.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
