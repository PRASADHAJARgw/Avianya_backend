import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-white min-h-screen rounded-xl mx-auto my-8 shadow-lg text-gray-800">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8">Privacy Policy for My React App</h1>
        <p className="mb-4 text-gray-700">
          At My React App, accessible from myreactapp.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by My React App and how we use it.
        </p>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Consent</h2>
        <p className="mb-4 text-gray-700">
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Information we collect</h2>
        <p className="mb-4 text-gray-700">
          The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
        </p>
        <p className="mb-4 text-gray-700">
          If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
        </p>
        <p className="mb-4 text-gray-700">
          When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
        </p>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">How we use your information</h2>
        <p className="mb-4 text-gray-700">
          We use the information we collect in various ways, including to:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Log Files</h2>
        <p className="mb-4 text-gray-700">
          My React App follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;