import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <section className='max_padd_container flexCenter flex-col pt-44'>
      <div className='text-3xl font-extrabold text-red-500'>
        Error 404 - Page Not Found
      </div>
      <div className='mt-4 font-semibold text-lg'>
        <Link to='/' className='text-blue-600 underline'>
          Go back to the homepage
        </Link>
      </div>
    </section>
  );
};

export default Error;
