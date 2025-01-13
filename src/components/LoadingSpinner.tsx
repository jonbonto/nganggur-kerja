import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px-72px)]">
      <div className="animate-spin border-t-4 border-blue-600 border-solid rounded-full w-16 h-16"></div>
    </div>
  );
};

export default LoadingSpinner;
