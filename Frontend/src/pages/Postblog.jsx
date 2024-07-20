import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput';
import { postBlog } from '../Api/internal';

const Postblog = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const author = useSelector(state => state.user._id);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setPhoto(reader.result);
      };
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    setError('');

    const data = { author, title, content, photo };

    try {
      const response = await postBlog(data);
      if (response.status === 201) {
        navigate('/blog');
      } else {
        setError('Failed to create the blog post. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Error posting blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='max_padd_container flex flex-col justify-center pt-40'>
      <div className='flexCenter flex-col'>
        <h4 className='bold-32 mb-6'>Create a Blog</h4>
        <TextInput
          type='text'
          name='title'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder='Your content here...'
          maxLength={2000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='py-3 px-7 m-2 outline-none w-full max-w-[355px] h-full min-h-56 bg-[#f7f7f7] rounded-3xl resize-none'
        />
        <div className='flex flex-col gap-y-3 my-2 w-full max-w-[355px]'>
          <div className='flex items-center gap-2'>
            <p className='flex flex-1'>Choose a photo</p>
            <input
              type="file"
              name='photo'
              id='photo'
              accept='image/jpg, image/jpeg, image/png'
              onChange={getPhoto}
              className='text-[14px] font-[500] flex flex-[2]'
            />
          </div>
          {photo && <img src={photo} alt='Blog preview' height={55} width={77} className='rounded-md' />}
        </div>
        {error && <span className='text-red-500 mt-2'>{error}</span>}
        <button
          onClick={submitHandler}
          className='btn_dark_rounded w-[333px] mt-4 disabled:bg-[#333]'
          disabled={title === '' || content === '' || photo === '' || loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </section>
  );
};

export default Postblog;
