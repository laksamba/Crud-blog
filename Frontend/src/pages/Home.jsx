import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { getNews } from '../Api/External';

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async function newsApiCall() {
      const response = await getNews();
      setArticles(response);
    })();
    setArticles([]);
  }, []);

  if (articles.length === 0) {
    return <Loader text="Homepage" />;
  }

  const handleClick = (url) => {
    window.open(url, '_blank'); // Open the article URL in a new tab
  };

  return (
    <section className='max_padd_container flex flex-col justify-center pt-32'>
      <h3 className='h3 font-extrabold mb-16 text-center'>Latest Articles</h3>
      {/* article container */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {articles.map((article) => (
          <div
            key={article.url}
            className='flex flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 rounded-3xl overflow-hidden hover:shadow-lg cursor-default transition-all duration-300'
          >
            <img
              src={article.urlToImage}
              alt='article photo'
              className='block object-cover w-full rounded-2xl h-44 bg-white'
            />
            <h4 className='text-left mt-4 bold-16 line-clamp-2 text-[#333]'>
              {article.title}
            </h4>
            <p className='line-clamp-3 mt-2 text-left'>{article.description}</p>
            <button
              onClick={() => handleClick(article.url)}
              className='btn_dark_rounded mt-4 w-[133px]'
            >
              Read more
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
