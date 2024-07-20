import React from 'react';

const TextInput = ({ error, errormessage, ...props }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-[355px]">
      <input
        {...props}
        className="py-3 px-7 m-2 outline-none w-full bg-[#efeeee] rounded-full"
      />
      {error && (
        <p className="text-red-600 text-left px-7 w-full max-w-[355px] mb-2">
          {errormessage}
        </p>
      )}
    </div>
  );
};

export default TextInput;
