import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deletBlog, getBlogId, getCommentsById, postCommet } from '../Api/internal';
import CommentList from '../components/CommentList';
import Loader from '../components/Loader';

const BlogDetails = () => {

  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [reload, setReload] = useState(false);
  

  const navigate = useNavigate();

  const params = useParams();
  const blogId = params.id;

  const username = useSelector(state =>state.user.username);
  const userId = useSelector(state =>state.user._id);
  // const token = useSelector(state => state.user.token);



  // get comment by id 
  useEffect(()=>{
    async function getBlogDetails(){
      const commentResponse = await getCommentsById(blogId);

      console.log("by id comment ",commentResponse);
      
      
      if(commentResponse.status === 200){
        console.log("hello",commentResponse.data.data);
        
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogId(blogId);

      if(blogResponse.status === 200){
        setOwnsBlog(username === blogResponse.data.post.authorUsername)
        setBlog(blogResponse.data.post)
      }
    }

    getBlogDetails();
    
  },[blogId,username])

  // handling the post coment 

  const postCommentHandler = async()=>{
    const data = {
      author: userId,
      post:blogId,
      content: newComment
    }
   
    const response = await postCommet(data);
  console.log("comments response",response)

    if(response.status === 201){
      setNewComment("");
      setReload(!reload);
    }
  }

  // delet handler 
  const deleteBlogHandler = async()=> {
    const response = await deletBlog(blogId);

    if(response.status === 200){
      navigate('/blog');
    }
  };
  if(blog.length === 0){
    return <Loader  text={"blog Details"}/>
  }


  
  return (
   <section  className='max_padd_container flex items-start justify-center flex-col gap-8 pt-32 md:flex-row '>
<div className='flex flex-1 flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 transition-all duration-300 overflow-hidden cursor-default rounded-3xl '>
  <h4 className='bold-20 capitalize'>{blog.title}</h4>
  <div className='my-3'>
    <p className='bold-16 text-gray-700'>@{blog.authorUsername }</p>
    <p> {" on " + new Date(blog.createdAt).toDateString()}</p>
  </div>
  <div>
    <img src={blog.photo} alt="photo"  className='mb-6 rounded-3xl'/>
  </div>
  <p>{blog.content}</p>
  {ownsBlog && (
    <div className='flexStart gap-2 my-6'>
      <button onClick={()=>navigate(`/blog-update/${blog._id}`)} className='btn_secondary_rounded'>Edit</button>
      <button onClick={deleteBlogHandler} className='btn_red_rounded'>Delete</button>
    </div>
  )}
</div>


{/* right side  comment */}
<div className=' flex-1'>
  <div >
  {/* comment list here */}
  <CommentList comments={comments}/>
    <div className='flexCenter gap-x-3'>
    
      <input
      type='text'
      placeholder='comment here'
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className='regular-14 py-3 px-5 my-2  bg-[#d3d1d1] rounded-full shadow-sm z-10'
      />
      <button onClick={postCommentHandler} className='btn_dark_rounded'>post</button>
    </div>
  </div>
</div>


   </section>
  )
}

export default BlogDetails