import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 md:px-12 bg-white min-h-screen rounded-xl mx-auto my-8 shadow-lg text-gray-800">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 bg-gray-100 p-2 rounded-lg shadow-neumorphic-light hover:shadow-neumorphic-pressed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span className="text-gray-800">Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold text-indigo-800 mb-8">Terms and Conditions for Avianya</h1>
        {/* ... rest of your terms and conditions content ... */}
      </div>
    </section>
  );
};

export default TermsAndConditions;