import axios from "axios";

// const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
// const  NEWS_API_ENDPOINT =` https://newsapi.org/v2/everything?q=bitcoin OR technology &apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
// const  NEWS_API_ENDPOINT =` https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&q=nepali%20stock%20news,political%20affairs&country=np&category=business,education `


const NEWS_API_ENDPOINT = "https://saurav.tech/NewsAPI/top-headlines/category/business/in.json"

const CRYPTO_API_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100'


export const getNews = async () => {
   let response;

   try {
    const pageNumber = Math.floor(Math.random() * 10) + 1; // random page
    response = await axios.get(NEWS_API_ENDPOINT,{
      params: {
        q: 'technology OR finance OR blockchain OR crypto',
        sortBy: 'publishedAt', // Sort by publication date
        page: pageNumber, // Randomize page number
        apiKey: `${import.meta.env.VITE_NEWS_API_KEY}`,
      },
    });
    response = response.data.articles.slice(0,20);
   } catch (error) {
    return error;
   }
   return  response;
  };
  


  export const getCrypto = async () => {
    let response;
 
    try {
     response = await axios.get(CRYPTO_API_ENDPOINT);
     response = response.data;
    } catch (error) {
     return error;
    }
    return  response;
   };