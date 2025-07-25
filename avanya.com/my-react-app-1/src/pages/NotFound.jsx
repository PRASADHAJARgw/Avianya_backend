import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;