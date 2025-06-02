import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageSquareText, Megaphone, Bot, LayoutGrid, Brain, Code, Rocket, Phone, Mail, MapPin, CheckCircle, Menu, X, Cpu } from 'lucide-react';

// Reusable Service Card Component
const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-gray-50 rounded-2xl p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-neumorphic-light-hover shadow-neumorphic-light"> {/* Changed background to bg-gray-50 */}
    <div className="mb-6 flex justify-center">
      {/* Ensure className is always a string by providing a default empty string */}
      {React.cloneElement(icon, { className: `${icon.props.className || ''} transition-colors duration-300 group-hover:text-indigo-700` })}
    </div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-800 transition-colors duration-300">{title}</h3>
    <p className="text-gray-700 leading-relaxed">{description}</p>
  </div>
);

// Reusable Feature Item Component
const FeatureItem = ({ icon, title, description }) => (
  <div className="bg-gray-50 rounded-2xl p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-neumorphic-light-hover shadow-neumorphic-light"> {/* Changed background to bg-gray-50 */}
    <div className="mb-4 flex justify-center">
      {/* Ensure className is always a string by providing a default empty string */}
      {React.cloneElement(icon, { className: `${icon.props.className || ''} transition-colors duration-300 group-hover:text-indigo-700` })}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-800 transition-colors duration-300">{title}</h3>
    <p className="text-gray-700 text-sm">{description}</p>
  </div>
);

// Reusable Contact Info Component
const ContactInfo = ({ icon, text }) => (
  <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-neumorphic-light hover:bg-gray-200 transition duration-300 transform hover:scale-105 text-indigo-700"> {/* Adjusted for light contact section */}
    {React.cloneElement(icon, { className: `${icon.props.className || ''} text-indigo-600` })} {/* Icon color for light theme */}
    <span className="ml-3 text-lg font-medium">{text}</span>
  </div>
);

// Privacy Policy Component
const PrivacyPolicy = ({ navigateTo }) => (
  <section className="py-16 px-6 md:px-12 bg-white min-h-screen rounded-xl mx-auto my-8 shadow-lg text-gray-800">
    <div className="container mx-auto max-w-4xl">
      <button
        onClick={() => navigateTo('home')}
        className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 bg-gray-100 p-2 rounded-lg shadow-neumorphic-light hover:shadow-neumorphic-pressed"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span className="text-gray-800">Back to Home</span>
      </button>
      <h1 className="text-4xl font-bold text-indigo-800 mb-8">Privacy Policy for Avianya</h1>
      <p className="mb-4 text-gray-700">
        At Avianya, accessible from avianya.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Avianya and how we use it.
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
        Avianya follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
      </p>
    </div>
  </section>
);

// Terms and Conditions Component
const TermsAndConditions = ({ navigateTo }) => (
  <section className="py-16 px-6 md:px-12 bg-white min-h-screen rounded-xl mx-auto my-8 shadow-lg text-gray-800">
    <div className="container mx-auto max-w-4xl">
      <button
        onClick={() => navigateTo('home')}
        className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 bg-gray-100 p-2 rounded-lg shadow-neumorphic-light hover:shadow-neumorphic-pressed"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span className="text-gray-800">Back to Home</span>
      </button>
      <h1 className="text-4xl font-bold text-indigo-800 mb-8">Terms and Conditions for Avianya</h1>
      <p className="mb-4 text-gray-700">
        Welcome to Avianya!
      </p>
      <p className="mb-4 text-gray-700">
        These terms and conditions outline the rules and regulations for the use of Avianya's Website, located at avianya.com.
      </p>
      <p className="mb-4 text-gray-700">
        By accessing this website we assume you accept these terms and conditions. Do not continue to use Avianya if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Cookies</h2>
      <p className="mb-4 text-gray-700">
        We employ the use of cookies. By accessing Avianya, you agreed to use cookies in agreement with the Avianya's Privacy Policy.
      </p>
      <p className="mb-4 text-gray-700">
        Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">License</h2>
      <p className="mb-4 text-gray-700">
        Unless otherwise stated, Avianya and/or its licensors own the intellectual property rights for all material on Avianya. All intellectual property rights are reserved. You may access this from Avianya for your own personal use subject to restrictions set in these terms and conditions.
      </p>
      <p className="mb-4 text-gray-700">You must not:</p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Republish material from Avianya</li>
        <li>Sell, rent or sub-license material from Avianya</li>
        <li>Reproduce, duplicate or copy material from Avianya</li>
        <li>Redistribute content from Avianya</li>
      </ul>
      <p className="mb-4 text-gray-700">
        This Agreement shall begin on the date hereof.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Hyperlinking to our Content</h2>
      <p className="mb-4 text-gray-700">
        The following organizations may link to our Website without prior written approval:
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Government agencies;</li>
        <li>Search engines;</li>
        <li>News organizations;</li>
        <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
        <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
      </ul>
      <p className="mb-4 text-gray-700">
        These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">iFrames</h2>
      <p className="mb-4 text-gray-700">
        Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Content Liability</h2>
      <p className="mb-4 text-gray-700">
        We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Reservation of Rights</h2>
      <p className="mb-4 text-gray-700">
        We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Removal of links from our website</h2>
      <p className="mb-4 text-gray-700">
        If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
      </p>
      <p className="mb-4 text-gray-700">
        We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Disclaimer</h2>
      <p className="mb-4 text-gray-700">
        To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>limit or exclude our or your liability for death or personal injury;</li>
        <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
        <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
        <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
      </ul>
      <p className="mb-4 text-gray-700">
        The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
      </p>
      <p className="mb-4 text-gray-700">
        As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
      </p>
    </div>
  </section>
);


// Main App Component
const App = () => {
  // Function to determine active section from URL path
  const getActiveSectionFromPath = useCallback(() => {
    const path = window.location.pathname;
    if (path === '/privacy-policy') {
      return 'privacy-policy';
    }
    if (path === '/terms-conditions') {
      return 'terms-conditions';
    }
    return 'home'; // Default to home for any other path
  }, []);

  const [activeSection, setActiveSection] = useState(getActiveSectionFromPath()); // For SPA-like routing
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0); // State to track scroll position
  const [formError, setFormError] = useState(''); // State for form validation error

  // Function to handle navigation
  const navigateTo = useCallback((sectionId) => {
    let newPath = '/';
    if (sectionId === 'privacy-policy') {
      newPath = '/privacy-policy';
    } else if (sectionId === 'terms-conditions') {
      newPath = '/terms-conditions';
    } else {
        // For 'home', 'services', 'consultancy', 'contact', keep the base path '/'
        // This ensures direct navigation to these sections doesn't change the URL path
        // unless coming from a policy page, in which case it resets to '/'
        if (window.location.pathname !== '/') {
            newPath = '/';
        } else {
            newPath = window.location.pathname; // Keep current path if already on home page
        }
    }

    // Only push state if the path is changing
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    
    setActiveSection(sectionId); // Update state

    // Smooth scroll to section if it's not a policy page
    if (sectionId !== 'privacy-policy' && sectionId !== 'terms-conditions') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
        // For policy pages, always scroll to the top of the window
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close menu on navigation
  }, []);

  // Effect to handle scroll position and update state
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to handle browser's back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const newActiveSection = getActiveSectionFromPath();
      setActiveSection(newActiveSection);

      // Also handle scrolling to top for policy pages when navigating via browser buttons
      // Or scroll to the relevant section on the main page
      if (newActiveSection === 'privacy-policy' || newActiveSection === 'terms-conditions') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          // If navigating back to 'home' or a section on the main page, try to scroll
          const section = document.getElementById(newActiveSection);
          if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
          } else {
              window.scrollTo({ top: 0, behavior: 'smooth' }); // Fallback to top if section not found (e.g. from / to /)
          }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getActiveSectionFromPath]); // getActiveSectionFromPath is a dependency here

  // Calculate dynamic background styles based on scrollPosition
  // These values can be tweaked for desired effect
  // Ensure heroHeight is at least 1 to prevent division by zero
  const heroHeight = Math.max(1, window.innerHeight);
  const scrollProgress = Math.min(1, scrollPosition / (heroHeight * 1.5)); // Progress over 1.5 viewports

  const overlayOpacity = scrollProgress * 0.6; // Max 60% dark overlay
  const blurAmount = scrollProgress * 8; // Max 8px blur
  const scaleAmount = 1 + (scrollProgress * 0.05); // Scales up to 105%
  const brightnessAmount = 1 - (scrollProgress * 0.3); // Darkens to 70% brightness

  // handleSubmit function for the contact form
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous errors

    const emailInput = e.target.elements.email;
    const phoneInput = e.target.elements.phone;

    // Client-side validation: Email OR Phone number must be provided
    if (!emailInput.value && !phoneInput.value) {
      setFormError('Please provide either an Email or a Phone Number.');
      return;
    }

    // If validation passes, you would typically send the form data here
    console.log('Form Data:', { // Using console.log instead of alert
      firstName: e.target.elements.firstName.value,
      lastName: e.target.elements.lastName.value,
      email: emailInput.value,
      phone: phoneInput.value,
      message: e.target.elements.message.value,
    });
    e.target.reset(); // Reset form fields
    setFormError(''); // Clear error after successful submission
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800">
      {/* Fixed Background Layer */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-100 ease-out -z-20" // Lower z-index to be behind content
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/6366F1/FFFFFF?text=Avianya+WhatsApp+Marketing')",
          filter: `blur(${blurAmount}px) brightness(${brightnessAmount})`,
          transform: `scale(${scaleAmount})`
        }}
      >
        {/* Dark overlay that increases with scroll */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-100"
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      {/* Main App Content - This will scroll */}
      <div className="relative z-10"> {/* All content needs to be above the fixed background */}
        {/* Header/Navigation */}
        <header className="py-4 px-6 md:px-12 bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
          <nav className="container mx-auto flex justify-between items-center">
            {/* Updated Logo Area with CPU icon and "AVIANYA TECH" text */}
            <div className="flex items-center space-x-2">
                <Cpu className="w-8 h-8 text-indigo-600" /> {/* Changed to Cpu icon */}
                <div className="text-2xl md:text-3xl font-extrabold text-indigo-800 tracking-wide">
                AVIANYA TECH {/* Changed text to "AVIANYA TECH" */}
                </div>
            </div>

            <ul className="hidden md:flex space-x-8">
              <li><a onClick={() => navigateTo('home')} className={`cursor-pointer text-gray-800 hover:text-indigo-900 font-medium transition duration-300 ${activeSection === 'home' ? 'text-indigo-900 font-bold' : ''}`}>Home</a></li>
              <li><a onClick={() => navigateTo('services')} className={`cursor-pointer text-gray-800 hover:text-indigo-900 font-medium transition duration-300 ${activeSection === 'services' ? 'text-indigo-900 font-bold' : ''}`}>Services</a></li>
              <li><a onClick={() => navigateTo('consultancy')} className={`cursor-pointer text-gray-800 hover:text-indigo-900 font-medium transition duration-300 ${activeSection === 'consultancy' ? 'text-indigo-900 font-bold' : ''}`}>Consultancy</a></li>
              <li><a onClick={() => navigateTo('contact')} className={`cursor-pointer text-gray-800 hover:text-indigo-900 font-medium transition duration-300 ${activeSection === 'contact' ? 'text-indigo-900 font-bold' : ''}`}>Contact</a></li>
            </ul>
            <button
              className="md:hidden p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 animate-fade-in-down border-b border-gray-200"> {/* Solid mobile menu */}
              <ul className="flex flex-col items-center space-y-4">
                <li><a onClick={() => navigateTo('home')} className="cursor-pointer text-gray-800 hover:text-indigo-700 font-medium text-lg block py-2">Home</a></li>
                <li><a onClick={() => navigateTo('services')} className="cursor-pointer text-gray-800 hover:text-indigo-700 font-medium text-lg block py-2">Services</a></li>
                <li><a onClick={() => navigateTo('consultancy')} className="cursor-pointer text-gray-800 hover:text-indigo-700 font-medium text-lg block py-2">Consultancy</a></li>
                <li><a onClick={() => navigateTo('contact')} className="cursor-pointer text-gray-800 hover:text-indigo-700 font-medium text-lg block py-2">Contact</a></li>
                <li><a onClick={() => navigateTo('privacy-policy')} className="cursor-pointer text-gray-800 hover:text-indigo-700 font-medium text-lg block py-2">Privacy Policy</a></li>
                <li><a onClick={() => navigateTo('terms-conditions')} className="cursor-pointer text-gray-800 hover:text-indigo-700 font-medium text-lg block py-2">Terms & Conditions</a></li>
              </ul>
            </div>
          )}
        </header>

        {/* Main Content Area (conditionally rendered or always visible) */}
        {activeSection === 'home' || activeSection === 'services' || activeSection === 'consultancy' || activeSection === 'contact' ? (
          <>
            {/* Hero Section */}
            <section id="home" className="relative flex items-center justify-center h-screen text-white bg-transparent"> {/* Background is transparent */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/70 to-blue-700/70"></div> {/* This overlay remains */}
              <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
                {/* Custom Chat Bubble Logo for Hero Section */}
                <div className="mb-8 animate-fade-in-up">
                  <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto animate-bounce-subtle">
                    <defs>
                      <linearGradient id="chatBubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#128C7E" /> {/* Darker WhatsApp Green */}
                        <stop offset="100%" stopColor="#25D366" /> {/* WhatsApp Green */}
                      </linearGradient>
                    </defs>
                    {/* Chat bubble path - Adjusted for a complete look */}
                    <path d="M20 10 Q0 10 0 30 V70 Q0 90 20 90 H160 L180 100 L180 90 Q200 90 200 70 V30 Q200 10 180 10 Z" fill="url(#chatBubbleGradient)" className="drop-shadow-lg"/>
                    {/* Text inside the bubble */}
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="bold" fontFamily="Inter, sans-serif">
                      Avianya
                    </text>
                  </svg>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
                  Elevate Your Business with <span className="text-yellow-300">WhatsApp Marketing</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up delay-200">
                  Avianya: Your dedicated partner for unparalleled growth through intelligent messaging, marketing, and AI solutions.
                </p>
                <a onClick={() => navigateTo('services')} className="cursor-pointer inline-block bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-neumorphic-light hover:shadow-neumorphic-pressed transition duration-300 transform hover:scale-105 animate-fade-in-up delay-400">
                  Explore Our Services
                </a>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 px-6 md:px-12 bg-white rounded-xl mx-auto shadow-lg"> {/* Removed my-8 */}
              <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">Our Core Services</h2>

                {/* WhatsApp Focused Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  <ServiceCard
                    icon={<MessageSquareText className="w-12 h-12 text-indigo-600" />}
                    title="WhatsApp Messaging Solutions"
                    description="Streamline your communication with efficient and scalable WhatsApp messaging, tailored for your business needs."
                  />
                  <ServiceCard
                    icon={<Megaphone className="w-12 h-12 text-indigo-600" />}
                    title="WhatsApp Marketing Campaigns"
                    description="Unlock the power of direct engagement with targeted WhatsApp marketing strategies to reach your audience effectively."
                  />
                  <ServiceCard
                    icon={<Bot className="w-12 h-12 text-indigo-600" />}
                    title="AI & Chatbots for WhatsApp"
                    description="Automate customer support and engagement with intelligent AI-powered chatbots designed specifically for WhatsApp."
                  />
                </div>

                {/* Other Digital Marketing Services */}
                <h3 className="text-3xl font-bold text-center text-indigo-800 mb-12">Beyond WhatsApp: Expanding Your Digital Reach</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ServiceCard
                    icon={<Rocket className="w-12 h-12 text-purple-600" />}
                    title="Meta Ads Management"
                    description="Maximize your reach and ROI with expertly managed Meta (Facebook & Instagram) advertising campaigns."
                  />
                  <ServiceCard
                    icon={<LayoutGrid className="w-12 h-12 text-purple-600" />}
                    title="Instagram Marketing Strategies"
                    description="Build a strong brand presence and engage your audience with compelling Instagram marketing tactics."
                  />
                </div>
              </div>
            </section>

            {/* Consultancy & Development Section */}
            <section id="consultancy" className="py-16 px-6 md:px-12 bg-indigo-50 rounded-xl mx-auto shadow-lg border border-indigo-100"> {/* Removed my-8 */}
              <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">Consultancy & Development Expertise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <ServiceCard
                    icon={<Brain className="w-12 h-12 text-green-600" />}
                    title="Strategic Business Consultancy"
                    description="Receive expert guidance to optimize your digital strategies and achieve your business objectives."
                  />
                  <ServiceCard
                    icon={<Code className="w-12 h-12 text-green-600" />}
                    title="Web & Mobile App Development"
                    description="Transform your ideas into robust and user-friendly web and mobile applications."
                  />
                  <ServiceCard
                    icon={<LayoutGrid className="w-12 h-12 text-green-600" />}
                    title="Data Science, AI & ML Consultation"
                    description="Leverage the power of data with our specialized consultation in Data Science, Artificial Intelligence, and Machine Learning."
                  />
                </div>
              </div>
            </section>

            {/* Why Choose Avianya Section */}
            <section className="py-16 px-6 md:px-12 bg-white rounded-xl mx-auto shadow-lg"> {/* Removed my-8 */}
              <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold text-indigo-800 mb-8">Why Choose Avianya?</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                  While others offer a broad spectrum, Avianya's unique strength lies in our deep specialization and unwavering focus on WhatsApp. We understand the nuances of this platform, ensuring your marketing efforts are not just seen, but truly resonate.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureItem
                    icon={<CheckCircle className="w-8 h-8 text-indigo-600" />}
                    title="WhatsApp Specialization"
                    description="Dedicated expertise in WhatsApp's ecosystem for maximum impact."
                  />
                  <FeatureItem
                    icon={<CheckCircle className="w-8 h-8 text-indigo-600" />}
                    title="Tailored Strategies"
                    description="Customized solutions designed to meet your specific business goals."
                  />
                  <FeatureItem
                    icon={<CheckCircle className="w-8 h-8 text-indigo-600" />}
                    title="Results-Driven Approach"
                    description="Focused on delivering measurable outcomes and tangible ROI."
                  />
                </div>
              </div>
            </section>
            {/* Contact Section */}
            <section id="contact" className="py-16 px-6 md:px-12 bg-white rounded-xl mx-auto shadow-lg text-gray-800"> {/* Light background for contact section */}
              <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold text-indigo-800 mb-8">Get in Touch</h2> {/* Solid text color for light theme */}
                <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-700"> {/* Text color adjusted for light theme */}
                  Ready to transform your digital presence? Contact us today to discuss how Avianya can help your business thrive.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                  {/* Updated to show phone and email in the main contact section */}
                  <ContactInfo icon={<Phone className="w-6 h-6" />} text="+917755991053" />
                  <ContactInfo icon={<Mail className="w-6 h-6" />} text="contact@avianya.com" />
                </div>
                <form onSubmit={handleSubmit} className="mt-12 max-w-md mx-auto bg-gray-50 p-8 rounded-2xl shadow-neumorphic-light text-gray-800"> {/* Form background: light gray, neumorphic shadow, text-gray-800 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-left text-sm font-medium text-gray-700 mb-1">First name</label>
                      <input type="text" id="firstName" placeholder="Enter your first name here" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 transition duration-200" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-left text-sm font-medium text-gray-700 mb-1">Last name</label>
                      <input type="text" id="lastName" placeholder="Enter your last name here" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 transition duration-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                      <input type="email" id="email" placeholder="Ex. johndoe@gmail.com" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 transition duration-200" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-left text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" id="phone" placeholder="+91XXXXXXXXXX" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 transition duration-200" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-left text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea id="message" placeholder="Enter your Message here..." rows="5" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 transition duration-200"></textarea>
                  </div>

                  {formError && (
                    <div className="text-red-500 text-sm mb-4 text-center">
                      {formError}
                    </div>
                  )}

                  <div className="text-left mb-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded-md border-gray-300 bg-gray-100 focus:ring-indigo-500 transition duration-150 ease-in-out" />
                      <span className="ml-2 text-gray-700 text-sm">
                        I hereby authorise to send notifications on SMS / Messages/Promotional/informational messages
                      </span>
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-neumorphic-light hover:shadow-neumorphic-pressed transition duration-300 transform hover:scale-105">
                    Submit
                  </button>
                </form>
              </div>
            </section>

          </>
        ) : (
          activeSection === 'privacy-policy' ? (
            <PrivacyPolicy navigateTo={navigateTo} />
          ) : activeSection === 'terms-conditions' ? (
            <TermsAndConditions navigateTo={navigateTo} />
          ) : null
        )}

        {/* Footer */}
        <footer className="py-8 px-6 md:px-12 bg-gray-900 text-white text-center border-t border-gray-700">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} Avianya. All rights reserved.</p>
            {/* Replaced "Focused on WhatsApp Marketing Excellence." with phone and email */}
            <div className="mt-2 flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-300" />
                <span className="text-gray-300">+917755991053</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-300" />
                <a href="mailto:contact@avianya.com" className="text-gray-300 hover:text-white transition duration-300">contact@avianya.com</a> {/* Made email clickable */}
              </div>
            </div>
            
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a onClick={() => navigateTo('privacy-policy')} className="cursor-pointer text-gray-300 hover:text-white transition duration-300">Privacy Policy</a>
              <a onClick={() => navigateTo('terms-conditions')} className="cursor-pointer text-gray-300 hover:text-white transition duration-300">Terms & Conditions</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;