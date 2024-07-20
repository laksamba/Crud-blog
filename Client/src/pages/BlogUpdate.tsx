

import React, {useEffect,useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../components/TextInput';
import {  getBlogId, updateBlog } from '../Api/internal';



const BlogUpdate = () => {
  const params = useParams();
  const blogId = params.id;
 

  const [content, setContent] =useState("")
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState('');
  
  const navigate = useNavigate();
  const author = useSelector(state => state.user._id);

  const getPhoto = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = ()=>{
      setPhoto(reader.result);
    }
  };


  const updateHandler = async()=>{
    let data;
    if(photo.includes('http')){
      data = {
        author,title,content,postId: blogId
      }
    }else{
      data = {
        author, title, content, photo, postId: blogId
      }
    }
  
    const response = await updateBlog(data);
    if (response.status === 200){
      navigate('/blog')
    }
  };

  useEffect(() => {
    async function getBlogDetails(){
      const response = await getBlogId(blogId);
      if(response.status === 200){
        setTitle(response.data.post.title)
        setContent(response.data.post.content)
        setPhoto(response.data.post.photo)
      }
    }
    getBlogDetails();
  }, [blogId])
  
  return (
    <section className='max_padd_container flex flex-col justify-center pt-40'>
     <div className='flexCenter flex-col'>
      
     <h4 className='bold-32 mb-6'>Edit a Blog</h4>
     <TextInput
     type='text'
     name = 'title'
     placeholder = 'title'
     value = {title}
     onChange = {(e)=> setTitle(e.target.value)}
     />
     <textarea
     placeholder = 'your content here...'
     maxLength = {500}
     value = {content}
     onChange = {(e)=>setContent(e.target.value)}
     className='py-3 px-7 m-2 outline-none w-full max-w-[355px] h-full min-h-56 bg-[#f7f7f7] rounded-3xl resize-none'
     />
     <div className='flex flex-col gap-y-3 my-2 w-full max-w-[355px]'>
      <div className='flex  items-center gap-2'>
        <p className='flex flex-1'>choose a photo</p>
        <input
         type="file" 
         name='phot'
         id='photo'
         accept='image/jpg, image/jpeg, image/png'
         onChange={getPhoto}
         className='text-[14px]font-[500] flex flex-[2]'
         />
      </div>
     <img src={photo} alt='photo' height={55} width={77} className='rounded-md'/> 
     </div>
     <button onClick={updateHandler} className='btn_dark_rounded w-[333px] mt-4 disabled:bg-[#333]' disabled={title==='' || content === '' || photo === ''}>submit</button>
     </div>
    </section>
  )
}

export default BlogUpdate;