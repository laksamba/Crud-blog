import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignupSchema from '../schemas/SignupSchema';
import { signup } from '../Api/internal';
import { setUser } from '../store/userSlice';



const Signup = () => {

  const [error, setError] = useState<string>(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { values, touched, handleBlur, handleChange, errors ,handleSubmit} = useFormik({
    initialValues: {
      name:"",
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const response = await signup(values);

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
    }
  })

  return (
    <div className='mx-auto max-w-[90%] px-2 flexCenter flex-col gap-2 pt-48 overflow-hidden'>
      <h2 className='bold-32 text-center mb-10 min-w-[355px]'> Create a Account</h2>
      <form onSubmit={handleSubmit}>
        <TextInput 
        type = 'text'
        name = 'name'
        placeholder= 'full name'
        value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.name && touched.name ? 1 : undefined}
          errormessage={errors.name}

        />
        <TextInput 
         type='email'
         name="email"
         placeholder='example@gmai.com'
         value={values.email}
         onBlur={handleBlur}
         onChange={handleChange}
         error={errors.email && touched.email ? 1 : undefined}
         errormessage={errors.email}
        />
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
        <TextInput
        type='password'
        name="confirmPassword"
        placeholder='confirmPassword'
        value={values.confirmPassword}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.confirmPassword && touched.confirmPassword ? 1 : undefined}
          errormessage={errors.confirmPassword}
        />
        <button className='btn_dark_rounded !py-[12px] mt-7 min-w-[299px] disabled:bg-[#333]' type="submit" > create account</button>
      </form>
      {error && <span className='mt-12 text-red-600'>{error}</span>}

      <span className='mt-12 text-gray-600'>Already have account?  
        <button className='text-blue-600 underline' onClick={() => navigate('/login')}>Login</button>
      </span>
      {error !== "" ? <p className='text-red-500 my-5 mx-0'>{error}</p> : ""}

    </div>
  )
}

export default Signup