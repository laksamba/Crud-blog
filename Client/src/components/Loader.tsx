import React from 'react';
import { ProgressBar } from 'react-loader-spinner';

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className='flexCenter flex-col gap-5 h-1/6 pt-44'>
      <h4>Loading {text}</h4>
      <ProgressBar 
        visible={true}
        height="100"
        width="100"
        barColor='#2949c6'
        ariaLabel='progress-bar-loading'
        wrapperStyle={{}}
        wrapperClass=''
      />
    </div>
  );
}

export default Loader;
