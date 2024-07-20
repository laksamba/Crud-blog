import { useEffect, useState } from 'react';
import { getCrypto } from '../Api/External';
import Loader from '../components/Loader';

const Crypto = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async function cryptoApiCall() {
      const response = await getCrypto();
      if (Array.isArray(response)) {
        setData(response);
      } else {
        console.error('API response is not an array:', response);
      }
    })();

    setData([]);
  }, []);

  if (data.length === 0) {
    return <Loader text={"cryptocurrency"} />;
  }

  const positiveNmbr = {
    color: "#90EE90",
  };
  const negativeNmbr = {
    color: "#ff0000",
  };

  return (
    <section className='max_padd_container pt-24'>
      <table className='w-full mx-auto'>
        <thead>
          <tr className='bg-slate-800/10 bold-20 sm:bold-22'>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>24h</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr
              key={coin.name}
              id={coin.id}
              className='border-b border-r-slate-900/50 text-gray-400 p-6 medium-14 text-center'
            >
              <td className='text-left'>{coin.market_cap_rank}. {coin.symbol}</td>
              <td className='flexCenter py-4'>
                <div className='sm:w-[30%] flex items-center text-left mx-auto gap-x-3 text-gray-400'>
                  <img src={coin.image} alt="coinimg" height={30} width={30} />
                  {coin.name}
                </div>
              </td>
              <td>{coin.current_price}</td>
              <td style={coin.price_change_percentage_24h < 0 ? negativeNmbr : positiveNmbr}>
                {coin.price_change_percentage_24h}
              </td>
              <td>{coin.total_volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Crypto;
