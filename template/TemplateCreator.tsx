import React, { useState, useEffect, useRef } from 'react';
import Preview from './components/Preview';
import { useAuth } from './contexts/AuthContext';
import { TemplateButton, SupportedApp, TemplateJson, SampleContent, HeaderFile, CarouselCard, SavedTemplate, TemplateVariable } from './types';
import { 
    Plus, Trash2, Smartphone, Globe, MessageSquare, 
    FileText, Image as ImageIcon, Video, File as FileIcon, MapPin, 
    Type as TypeIcon, Layout, AlertCircle, CheckCircle, Code, Lock, Layers, Copy, X, ShoppingBag, Phone, Clock,
    Sparkles, Wand2, RefreshCw, Bot, Upload, ArrowRight, Link as LinkIcon, Download, Grid,
    Bold, Italic, Strikethrough, CornerDownLeft
} from 'lucide-react';
import clsx from 'clsx'; 
import { GoogleGenAI, Type } from "@google/genai";

// Simple UUID generator for demo purposes
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Helper for API Key Selection (Required for Pro models)
const ensureApiKey = async () => {
    // Check if window.aistudio exists
    if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
    }
};

let buttonIdCounter = 0;
let appIdCounter = 0;
let cardIdCounter = 0;

// UI Component: Form Section Wrapper
const FormSection = ({ title, children, icon: Icon, description, rightElement }: { title: string, children?: React.ReactNode, icon?: any, description?: string, rightElement?: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
                {Icon && <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Icon size={20} /></div>}
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
                </div>
            </div>
            {rightElement}
        </div>
        <div className="p-6 space-y-5">
            {children}
        </div>
    </div>
);

// UI Component: Input Field
const InputField = ({ label, error, rightElement, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string, rightElement?: React.ReactNode }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
        <div className="relative">
            <input 
                className={clsx(
                    "block w-full px-3 py-2.5 bg-white border rounded-lg text-sm transition-colors focus:ring-2 focus:ring-emerald-500/20 outline-none",
                    error ? "border-red-300 focus:border-red-500" : "border-slate-300 focus:border-emerald-500"
                )} 
                {...props} 
            />
            {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{rightElement}</div>}
        </div>
        {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
    </div>
);

// UI Component: Rich Text Editor with Formatting Toolbar
interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    maxLength?: number;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, maxLength = 1024, rows = 5, placeholder, required, error }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const applyFormat = (symbol: string, isWrap = true) => {
        if (!textareaRef.current) return;
        
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = value;
        
        let newText = "";
        let newCursorPos = end;

        if (start === end) {
            // No selection: Insert symbol at cursor
             newText = text.substring(0, start) + symbol + text.substring(end);
             newCursorPos = start + symbol.length;
        } else {
            // Selection: Wrap text
            const selectedText = text.substring(start, end);
            newText = text.substring(0, start) + symbol + selectedText + (isWrap ? symbol : '') + text.substring(end);
            newCursorPos = end + (isWrap ? symbol.length * 2 : symbol.length);
        }

        if (maxLength && newText.length > maxLength) return;

        onChange(newText);
        
        // Restore focus and cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const addVariable = () => {
        const varCount = (value.match(/{{\d+}}/g) || []).length + 1;
        applyFormat(`{{${varCount}}}`, false);
    };

    return (
        <div className={clsx("border rounded-lg overflow-hidden transition-all", error ? "border-red-300" : "border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20")}>
            <div className="flex items-center gap-1 bg-slate-50 border-b border-slate-200 px-2 py-1.5">
                <button type="button" onClick={() => applyFormat('*')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="Bold (*text*)"><Bold size={14}/></button>
                <button type="button" onClick={() => applyFormat('_')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="Italic (_text_)"><Italic size={14}/></button>
                <button type="button" onClick={() => applyFormat('~')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="Strikethrough (~text~)"><Strikethrough size={14}/></button>
                <button type="button" onClick={() => applyFormat('```')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="Monospace (```text```)"><Code size={14}/></button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button type="button" onClick={() => applyFormat('\n', false)} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="New Line"><CornerDownLeft size={14}/></button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button type="button" onClick={addVariable} className="text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded transition-colors flex items-center gap-1"><Plus size={12}/> Variable</button>
            </div>
            <div className="relative">
                <textarea 
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    maxLength={maxLength}
                    className="block w-full px-3 py-3 bg-white text-sm outline-none resize-none font-sans"
                    placeholder={placeholder}
                    required={required}
                />
                <div className="absolute bottom-2 right-2 text-xs text-slate-400 pointer-events-none bg-white/80 px-1 rounded">{value.length}/{maxLength}</div>
            </div>
        </div>
    );
};

interface TemplateCreatorProps {
    initialTemplateJson?: TemplateJson;
    onSave?: (template: SavedTemplate) => void;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ initialTemplateJson, onSave }) => {
    const { user } = useAuth();
    
    // Core Info
    const [templateName, setTemplateName] = useState("");
    const [language, setLanguage] = useState("en_US");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // AI State
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [shouldGenerateAiImages, setShouldGenerateAiImages] = useState(true);
    const [referenceImages, setReferenceImages] = useState<{ data: string, type: string }[]>([]);
    
    // AI Variations State
    const [aiVariations, setAiVariations] = useState<any[]>([]);
    const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
    const [manualImageOverride, setManualImageOverride] = useState<string | null>(null);

    // --- STANDALONE IMAGE GEN STATE ---
    const [showImageGenModal, setShowImageGenModal] = useState(false);
    const [imageGenContext, setImageGenContext] = useState<{ target: 'HEADER' | 'CAROUSEL', cardIndex?: number } | null>(null);
    const [imageGenPrompt, setImageGenPrompt] = useState("");
    const [imageGenRefImage, setImageGenRefImage] = useState<{data: string, type: string} | null>(null);
    const [generatedImagePreview, setGeneratedImagePreview] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    // Sub-category state
    const [templateType, setTemplateType] = useState("Default");
    const [catalogFormat, setCatalogFormat] = useState("Catalog message");

    // UI State for Form (Standard)
    const [bodyText, setBodyText] = useState<string>("");
    const [headerType, setHeaderType] = useState("NONE");
    const [headerText, setHeaderText] = useState<string>("");
    const [headerSampleContents, setHeaderSampleContents] = useState<SampleContent>({});
    const [footerText, setFooterText] = useState("");
    const [buttons, setButtons] = useState<TemplateButton[]>([]);
    const [sampleContents, setSampleContents] = useState<SampleContent>({});
    const [headerFile, setHeaderFile] = useState<HeaderFile | null>(null);
    const [headerExistingMediaLink, setHeaderExistingMediaLink] = useState<string | null>(null);

    // Carousel Specific State
    const [carouselCards, setCarouselCards] = useState<CarouselCard[]>([
        { id: 1, bodyText: "", buttonValues: {}, sampleContents: {} },
        { id: 2, bodyText: "", buttonValues: {}, sampleContents: {} }
    ]);
    const [carouselHeaderFormat, setCarouselHeaderFormat] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);

    // Authentication Specific State
    const [authType, setAuthType] = useState("COPY_CODE");
    const [addSecurityRecommendation, setAddSecurityRecommendation] = useState(false);
    const [addExpiry, setAddExpiry] = useState(false);
    const [expiryMinutes, setExpiryMinutes] = useState(5);
    const [supportedApps, setSupportedApps] = useState<SupportedApp[]>([{ id: 0, package_name: '', signature_hash: '' }]);
    const [autofillText] = useState("Autofill");
    const [copyCodeText] = useState("Copy Code");
    const [addValidityPeriod, setAddValidityPeriod] = useState(false);
    const [validityPeriodSeconds, setValidityPeriodSeconds] = useState(60);
    const [zeroTapConsent, setZeroTapConsent] = useState(false);

    // Final JSON
    const [templateJson, setTemplateJson] = useState<any>({});
    const [sendMessageJson, setSendMessageJson] = useState<any>({});

    const isInitialMount = useRef(true);

    // --- EFFECTS ---
    // Reset buttons when type changes
    useEffect(() => {
        if (templateType === 'Carousel') {
            const valid = buttons.filter(b => b.type === 'QUICK_REPLY' || b.type === 'URL' || b.type === 'PHONE_NUMBER').slice(0, 2);
            setButtons(valid);
        } else if (templateType === 'Default') {
            setButtons(prev => prev.filter(b => b.type !== 'COPY_CODE')); // Remove copy code if not auth (though Standard supports it now technically via COUPON, simpler to reset)
        }
    }, [templateType]);

    const handleReferenceImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: { data: string, type: string }[] = [];
            const remainingSlots = 3 - referenceImages.length;
            const filesToProcess = Array.from(files).slice(0, remainingSlots);

            filesToProcess.forEach(file => {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const result = evt.target?.result as string;
                    const base64Data = result.split(',')[1];
                    setReferenceImages(prev => [...prev, { data: base64Data, type: file.type }]);
                };
                reader.readAsDataURL(file);
            });
            
            if (files.length > remainingSlots) {
                alert("Maximum 3 reference images allowed.");
            }
        }
    };

    const removeReferenceImage = (index: number) => {
        setReferenceImages(prev => prev.filter((_, i) => i !== index));
    };

    const openImageGen = (target: 'HEADER' | 'CAROUSEL', cardIndex?: number) => {
        setImageGenContext({ target, cardIndex });
        if (target === 'HEADER') setImageGenPrompt(headerText || "A professional header image for this campaign");
        else if (target === 'CAROUSEL' && cardIndex !== undefined) setImageGenPrompt(carouselCards[cardIndex]?.bodyText || "A product image for this card");
        
        setImageGenRefImage(null);
        setGeneratedImagePreview(null);
        setShowImageGenModal(true);
    };

    const handleImageGenRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const result = evt.target?.result as string;
                const base64Data = result.split(',')[1];
                setImageGenRefImage({ data: base64Data, type: file.type });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateStandaloneImage = async () => {
        if (!imageGenPrompt.trim()) return alert("Please enter a description for the image.");
        setIsGeneratingImage(true);
        try {
             await ensureApiKey();
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
             const parts: any[] = [];
             if (imageGenRefImage) {
                 const refImg = imageGenRefImage as { data: string; type: string };
                 parts.push({ inlineData: { mimeType: refImg.type, data: refImg.data } });
                 parts.push({ text: `Create a new image based on this reference image. ${imageGenPrompt}` });
             } else {
                 parts.push({ text: imageGenPrompt });
             }

             const response = await ai.models.generateContent({
                 model: 'gemini-3-pro-image-preview',
                 contents: { parts },
                 config: { imageConfig: { aspectRatio: "1:1", imageSize: "2K" } }
             });
             
             let found = false;
             for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const url = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    setGeneratedImagePreview(url);
                    found = true;
                    break;
                }
             }
             if (!found) {
                 alert("No image was generated. Please try a different prompt.");
             }
        } catch(e) {
            console.error("Image generation failed", e);
            alert("Error generating image. Please check API key or try again.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const applyGeneratedImage = () => {
        if (!generatedImagePreview || !imageGenContext) return;
        
        if (imageGenContext.target === 'HEADER') {
            setHeaderFile({ url: generatedImagePreview, type: 'image/png' });
        } else if (imageGenContext.target === 'CAROUSEL' && imageGenContext.cardIndex !== undefined) {
            setCarouselCards(prev => {
                const newCards = [...prev];
                newCards[imageGenContext.cardIndex!] = { 
                    ...newCards[imageGenContext.cardIndex!], 
                    headerFile: { url: generatedImagePreview!, type: 'image/png' } 
                };
                return newCards;
            });
        }
        setShowImageGenModal(false);
    };

    const generateTemplateWithAI = async () => {
        if (!aiPrompt.trim() && !websiteUrl.trim()) return alert("Please enter a description or a website URL.");
        setIsAiGenerating(true);
        setAiVariations([]); 
        setSelectedVariationIndex(0);
        setManualImageOverride(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let websiteContext = "";
            if (websiteUrl) {
                try {
                    const searchResponse = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: `Analyze this website: ${websiteUrl}. Extract the brand name, key products, tone of voice, brand colors (if described), and any current offers. Summarize this as context for a marketing campaign.`,
                        config: { tools: [{ googleSearch: {} }] },
                    });
                    websiteContext = searchResponse.text;
                } catch (err) {
                    console.error("Website analysis failed", err);
                    websiteContext = "Could not analyze website. Proceeding with prompt only.";
                }
            }

            const schema = {
                type: Type.OBJECT,
                properties: {
                    variations: {
                        type: Type.ARRAY,
                        description: "Generate exactly 3 different variations of the template.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                variationName: { type: Type.STRING },
                                name: { type: Type.STRING },
                                category: { type: