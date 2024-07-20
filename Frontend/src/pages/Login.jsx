import React, { useState } from 'react';
import TextInput from '../components/TextInput';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import LoginSchema from '../schemas/LoginSchema';
import { login } from '../Api/internal';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, touched, handleBlur, handleChange, errors, handleSubmit } = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true); // Set loading to true when the form is submitted
      setError(''); // Clear any previous errors

      try {
        const response = await login(values);

        if ('user' in response) {
          const user = {
            _id: response.user._id,
            email: response.user.email,
            username: response.user.username,
            auth: response.auth
          };
          dispatch(setUser(user));
          navigate('/');
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false); // Reset loading state regardless of success or failure
      }
    }
  });

  return (
    <div className='mx-auto max-w-[90%] px-2 flexCenter flex-col gap-2 pt-48 overflow-hidden'>
      <h2 className='bold-32 text-center mb-10 min-w-[355px]'>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <TextInput 
          type='text'
          name="username"
          placeholder='username'
          value={values.username}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <TextInput
          type='password'
          name="password"
          placeholder='password'
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
        <button 
          className='btn_dark_rounded !py-[12px] mt-7 min-w-[299px] disabled:bg-[#333]' 
          type="submit" 
          disabled={loading} // Disable the button when loading
        >
          {loading ? 'Logging in...' : 'Log In'} {/* Show loading text */}
        </button>
      </form>
      {error && <span className='mt-12 text-red-600'>{error}</span>}
      <span className='mt-12 text-gray-600'>Don't have an account?  
        <button className='text-blue-600 underline' onClick={() => navigate('/signup')}>Register</button>
      </span>
    </div>
  );
};

export default Login;
