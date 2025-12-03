import React from 'react';
import { ComponentJson, HeaderFile, SampleContent, CarouselCard } from '../types';
import { ExternalLink, Phone, Reply, Lock, MoreVertical, Search, ArrowLeft, ShoppingBag, Copy } from 'lucide-react';

interface PreviewProps {
    components: ComponentJson[];
    category: string;
    addSecurityRecommendation?: boolean;
    authType?: string;
    sampleContents: SampleContent;
    headerFile: HeaderFile | null;
    headerSampleContents: SampleContent;
    carouselCards?: CarouselCard[];
}

const Preview: React.FC<PreviewProps> = ({
    components = [],
    addSecurityRecommendation,
    sampleContents,
    headerFile,
    headerSampleContents,
    carouselCards
}) => {
    const headerComponent = components.find(c => c.type === 'HEADER');
    const bodyComponent = components.find(c => c.type === 'BODY');
    const footerComponent = components.find(c => c.type === 'FOOTER');
    const buttonsComponent = components.find(c => c.type === 'BUTTONS');
    const carouselComponent = components.find(c => c.type === 'CAROUSEL');
    const callPermissionComponent = components.find(c => c.type === 'CALL_PERMISSION_REQUEST');

    // Helper to interpolate variables
    const interpolateText = (text: string, samples: SampleContent) => {
        if (!text) return '';
        return text.replace(/{{\d+}}/g, (match) => {
            const varNum = match.match(/\d+/)?.[0];
            return varNum && samples && samples[varNum] ? samples[varNum] : match;
        });
    };

    // Helper to format WhatsApp style text (*bold*, _italic_, ~strike~, ```code```) to HTML
    const formatWhatsAppText = (text: string) => {
        if (!text) return '';
        
        let formatted = text
            // Escape HTML characters to prevent XSS before we add our own tags
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        // Code blocks ```text```
        formatted = formatted.replace(/```(.*?)```/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-red-500 text-[11px] border border-gray-200">$1</code>');
        
        // Bold *text*
        formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        
        // Italic _text_
        formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Strikethrough ~text~
        formatted = formatted.replace(/~(.*?)~/g, '<del>$1</del>');
        
        // Newlines
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    };

    const renderHeader = (header?: ComponentJson, file?: HeaderFile | null) => {
        if (!header) return null;

        if (header.format === 'TEXT') {
            const text = interpolateText(header.text || '', headerSampleContents);
            return <div className="font-bold text-gray-900 mb-1">{text}</div>;
        }

        if (header.format === 'IMAGE') {
            return (
                <div className="rounded-lg overflow-hidden mb-2 bg-gray-200 w-full">
                    {file?.url ? (
                        <img src={file.url} alt="Header" className="w-full h-auto block" />
                    ) : (
                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Image Header</span>
                        </div>
                    )}
                </div>
            );
        }

        if (header.format === 'VIDEO') {
             return (
                <div className="rounded-lg overflow-hidden mb-2 bg-gray-800 w-full h-40 flex items-center justify-center text-white">
                     <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">▶</div>
                </div>
            );
        }
        
        if (header.format === 'DOCUMENT') {
            return (
               <div className="rounded-lg mb-2 bg-gray-100 p-3 flex items-center gap-2 border border-gray-200">
                    <div className="bg-red-500 text-white text-[10px] font-bold px-1 py-3 rounded">PDF</div>
                    <span className="text-sm text-gray-700 truncate">Document.pdf</span>
               </div>
           );
       }

        return null;
    };

    const renderButtons = (btns?: any[], compact = false) => {
        if (!btns) return null;

        return (
            <div className={`flex flex-col gap-2 mt-2 ${compact ? 'px-2 pb-2' : ''}`}>
                {btns.map((btn: any, idx: number) => {
                    let Icon = Reply;
                    let label = btn.text;
                    let color = "text-[#00a884]";
                    let bg = "bg-white";

                    if (btn.type === 'URL') Icon = ExternalLink;
                    if (btn.type === 'PHONE_NUMBER') Icon = Phone;
                    if (btn.type === 'OTP') {
                        label = btn.text || 'Copy Code';
                        color = "text-gray-800";
                    }
                    if (btn.type === 'COPY_CODE') {
                        Icon = Copy;
                        label = "Copy Code"; 
                        label = btn.example ? `Copy Code (${btn.example})` : 'Copy Code';
                        color = "text-gray-800";
                    }
                    if (btn.type === 'CATALOG' || btn.type === 'MPM') {
                        Icon = ShoppingBag;
                        color = "text-gray-800";
                    }

                    return (
                        <div key={idx} className={`${bg} h-9 rounded shadow-sm border border-gray-100 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors`}>
                            <Icon size={14} className={color} />
                            <span className={`text-xs font-medium ${color} truncate`}>{label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Current Time for phone status bar
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="sticky top-6">
             <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                
                {/* Screen Content */}
                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#E5DDD5] relative flex flex-col">
                    
                    {/* Status Bar */}
                    <div className="h-6 bg-[#075E54] flex justify-between items-center px-4 text-white text-[10px]">
                        <span>{timeString}</span>
                        <div className="flex gap-1">
                            <span>5G</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* App Header */}
                    <div className="h-14 bg-[#128C7E] flex items-center px-3 text-white shadow-md z-10">
                        <ArrowLeft size={20} className="mr-2" />
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 overflow-hidden">
                             <img src="https://picsum.photos/40/40" alt="Avatar" className="w-full h-full" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold leading-tight">Business Name</div>
                            <div className="text-[10px] opacity-80">Official Business Account</div>
                        </div>
                        <div className="flex gap-3">
                            <Phone size={18} />
                            <MoreVertical size={18} />
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
                        
                        {/* Date Pill */}
                        <div className="flex justify-center mb-4">
                            <span className="bg-[#DCF8C6] text-gray-600 text-[10px] px-2 py-1 rounded shadow-sm opacity-90">Today</span>
                        </div>

                        {/* Standard Message Bubble (Rendered for Standard OR as Top Body for Carousel) */}
                        {bodyComponent && (
                            <div className="bg-white rounded-lg rounded-tl-none shadow-sm p-1 max-w-[90%] mb-2 relative">
                                <div className="p-2 pb-4">
                                    {/* Only show header if NOT carousel, or if the main message had a header (unlikely for carousel type usually) */}
                                    {!carouselComponent && renderHeader(headerComponent, headerFile)}
                                    
                                    <div className="text-sm text-gray-800 leading-relaxed break-words">
                                        <div dangerouslySetInnerHTML={{ __html: formatWhatsAppText(interpolateText(bodyComponent.text || '', sampleContents)) }} />
                                        
                                        {addSecurityRecommendation && (
                                            <div className="mt-2 text-gray-500 text-xs flex items-center gap-1">
                                                <Lock size={12} />
                                                For your security, do not share this code.
                                            </div>
                                        )}
                                    </div>
                                    
                                    {footerComponent && (
                                        <div className="text-[11px] text-gray-500 mt-2 pt-1">
                                            {footerComponent.text}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                    <span className="text-[10px] text-gray-400">{timeString}</span>
                                </div>
                            </div>
                        )}

                        {/* Carousel Component */}
                        {carouselComponent && carouselComponent.cards && (
                             <div className="flex overflow-x-auto gap-2 pb-2 -ml-3 px-3 w-[calc(100%+24px)] custom-scrollbar">
                                {carouselComponent.cards.map((card: any, idx: number) => {
                                    const cardHeader = card.components.find((c: any) => c.type === 'HEADER');
                                    const cardBody = card.components.find((c: any) => c.type === 'BODY');
                                    const cardButtons = card.components.find((c: any) => c.type === 'BUTTONS');

                                    // Mock header file for carousel preview
                                    let cardFile = cardHeader?.format === 'IMAGE' ? { url: "https://picsum.photos/200/120", type: 'image' } : undefined;
                                    const cardData = carouselCards && carouselCards[idx];
                                    if (cardData && cardData.headerFile) {
                                        cardFile = cardData.headerFile;
                                    }

                                    const displayText = cardData ? interpolateText(cardBody.text || '', cardData.sampleContents || {}) : (cardBody.text || '');

                                    return (
                                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 min-w-[220px] max-w-[220px] flex-shrink-0 flex flex-col">
                                            <div className="p-2 flex-1">
                                                {renderHeader(cardHeader, cardFile)}
                                                {cardBody && (
                                                    <div className="text-sm text-gray-800 leading-relaxed break-words">
                                                         <div dangerouslySetInnerHTML={{ __html: formatWhatsAppText(displayText) }} />
                                                    </div>
                                                )}
                                            </div>
                                            {renderButtons(cardButtons?.buttons, true)}
                                        </div>
                                    );
                                })}
                             </div>
                        )}

                        {/* Render Buttons outside the bubble for WA style (Standard) */}
                        {!carouselComponent && !callPermissionComponent && renderButtons(buttonsComponent?.buttons)}
                        
                        {/* Call Permission Buttons */}
                        {callPermissionComponent && (
                            <div className="flex flex-col gap-2 mt-2 px-10">
                                <div className="bg-white h-9 rounded shadow-sm border border-gray-100 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-emerald-600 font-semibold text-xs">
                                    Allow
                                </div>
                                <div className="bg-white h-9 rounded shadow-sm border border-gray-100 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-red-500 font-semibold text-xs">
                                    Decline
                                </div>
                            </div>
                        )}

                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Preview;