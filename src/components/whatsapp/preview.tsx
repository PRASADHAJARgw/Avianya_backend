


import React, { useState } from 'react';
import backgroundImage from '../../assets/images/IMG_3298.jpg';
import { FaGlobe, FaPhone, FaReply, FaCopy, FaList, FaAutoprefixer, FaArrowLeft, FaVideo, FaWifi, FaSignal, FaBatteryFull, FaTimes,FaMapMarkerAlt } from 'react-icons/fa';

const buttonIconMap = {
    URL: <FaGlobe className="inline mr-2" />,
    PHONE_NUMBER: <FaPhone className="inline mr-2" />,
    QUICK_REPLY: <FaReply className="inline mr-2" />,
    OTP_COPY_CODE: <FaCopy className="inline mr-2" />,
    OTP_ONE_TAP: <FaAutoprefixer className="inline mr-2" />
};

const Preview = ({ components = [], sampleContents = {}, category, addSecurityRecommendation, authType, headerFile, headerSampleContents = {} }) => {
    const [showAllOptions, setShowAllOptions] = useState(false);

    const header = components.find(c => c.type === 'HEADER');
    const body = components.find(c => c.type === 'BODY');
    const footer = components.find(c => c.type === 'FOOTER');
    const buttonsComponent = components.find(c => c.type === 'BUTTONS');
    const buttons = buttonsComponent?.buttons || [];

    // const renderHeader = () => {
    //     if (!header) return null;
    //     if (header.format === 'TEXT') {
    //         return <p className="font-bold text-black p-2">{header.text || "Header text..."}</p>;
    //     }
    //     return <div className="bg-gray-200 h-32 flex items-center justify-center text-gray-500 font-semibold">[{header.format} Preview]</div>;
    // };
    const renderHeader = () => {
        if (!header) return null;

        if (headerFile) {
            if (headerFile.type.startsWith('image/')) {
                return <img src={headerFile.url} alt="Header preview" className="w-full h-auto" />;
            }
            if (headerFile.type.startsWith('video/')) {
                return <video src={headerFile.url} controls className="w-full h-auto" />;
            }
            // For documents, you might just show an icon and name
            return <div className="bg-gray-200 p-4 text-center text-sm">Document Preview</div>;
        }

        if (header.format === 'TEXT') {
            const textToRender = header.text || "Header text...";
            let formatted = textToRender
                .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br />');
            const finalHtml = formatted.replace(/{{\d+}}/g, (match) => {
                const varNum = match.match(/\d+/)[0];
                const sample = headerSampleContents[varNum];
                return `<span class="text-blue-500 font-semibold">${sample || `[Sample]`}</span>`;
            });
            return <p className="font-bold text-black p-2" dangerouslySetInnerHTML={{ __html: finalHtml }} />;
        }
        if (header.format === 'LOCATION') {
            return <div className="bg-gray-200 h-32 flex flex-col items-center justify-center text-gray-500 font-semibold"><FaMapMarkerAlt size={40} /><p>Location Preview</p></div>;
        }
        return <div className="bg-gray-200 h-32 flex items-center justify-center text-gray-500 font-semibold">[{header.format} Preview]</div>;
    };


    const renderBodyWithSamples = () => {
        let textToRender = body?.text;
        if (category === "AUTHENTICATION") {
            textToRender = "{{1}} is your verification code.";
            if (addSecurityRecommendation) {
                 textToRender += " For your security, do not share this code.";
            }
        }
        if (!textToRender) return "Body of the message will appear here.";

        // --- NEW FORMATTING LOGIC ---
        let formattedText = textToRender
            // 1. Replace *word* with <strong>word</strong> for bolding
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            // 2. Replace \n with <br /> for new lines
            .replace(/\\n/g, '<br />');

        // 3. Replace variables with sample content
        const finalHtml = formattedText.replace(/{{\d+}}/g, (match) => {
            const varNum = match.match(/\d+/)[0];
            const sample = sampleContents[varNum];
            return `<span class="text-blue-500 font-semibold">${sample || `[Sample]`}</span>`;
        });
        
        return <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: finalHtml }} />;
    };
    
    const renderButtons = () => {
        if (category === 'AUTHENTICATION') {
            if (authType === 'ZERO_TAP') return null;
            const text = authType === 'ONE_TAP' ? 'Auto Fill' : 'Copy Code';
            const icon = authType === 'ONE_TAP' ? buttonIconMap.OTP_ONE_TAP : buttonIconMap.OTP_COPY_CODE;
            return (
                <div className="bg-gray-100 text-blue-600 p-3 rounded-b-lg text-center text-sm w-full border-t border-gray-200">
                   {icon} {text}
                </div>
            );
        }
        const displayedButtons = buttons.length > 3 ? buttons.slice(0, 2) : buttons;
        return (
            <>
                {displayedButtons.map((btn, index) => (
                    <div key={index} className="bg-gray-100 text-blue-600 p-3 text-center text-sm w-full border-t border-gray-200">
                       {buttonIconMap[btn.type]} {btn.text || "[Button Text]"}
                    </div>
                ))}
                {buttons.length > 3 && (
                    <div onClick={() => setShowAllOptions(true)} className="bg-gray-100 text-blue-600 p-3 rounded-b-lg text-center text-sm w-full border-t border-gray-200 cursor-pointer">
                       <FaList className="inline mr-2" /> See all options
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="phone-frame">
            
            <div className="phone-screen">
                <div className="relative font-sans h-full flex flex-col rounded-xl" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
                    <header className="bg-[#128C7E] text-white p-3 flex items-center gap-4 shadow-md z-10 rounded-t-xl">
                        <FaArrowLeft />
                        <img src="https://via.placeholder.com/40" alt="profile" className="w-10 h-10 rounded-full"/>
                        <div>
                            <h2 className="font-semibold">Business Name</h2>
                            <p className="text-xs">online</p>
                        </div>
                        <div className="ml-auto flex gap-4 text-xl">
                            <FaVideo />
                            <FaPhone />
                        </div>
                    </header>

                     <p className="text-xs text-center text-gray-600 bg-blue-100/70 rounded-full py-1 px-3 w-fit mx-auto mt-3">Template Preview</p>
                    <div className="flex-grow p-4">
                        <div className="bg-white rounded-lg shadow-md max-w-xs ml-4">
                           {renderHeader()}
                            <div className="p-2">
                                {renderBodyWithSamples()}
                                {footer && <p className="text-xs text-gray-500 mt-2">{footer.text || `Code expires in ${footer.code_expiration_minutes} minutes.`}</p>}
                                <p className="text-right text-xs text-gray-400 mt-1">7:35 PM</p>
                            </div>
                        </div>
                        <div className="max-w-xs ml-4 flex flex-col items-stretch rounded-lg shadow-md overflow-hidden mt-1">
                           {renderButtons()}
                        </div>
                    </div>

                    {showAllOptions && (
                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end" onClick={() => setShowAllOptions(false)}>
                            <div className="bg-white rounded-t-2xl p-4 relative" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setShowAllOptions(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                                    <FaTimes size={20} />
                                </button>
                                
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                <h3 className="font-bold text-center mb-4">All Options</h3>
                                <div className="space-y-2">
                                    {buttons.map((btn, index) => (
                                        <div key={index} className="flex items-center text-gray-800 p-2">
                                            {buttonIconMap[btn.type]} 
                                            <span className="ml-3">{btn.text || "[Button Text]"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Preview;


