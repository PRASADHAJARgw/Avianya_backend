import React, { useState, useEffect, useRef } from 'react';
import Preview from './Preview';
import { useAuthStore } from '@/store/authStore';
import { TemplateButton, SupportedApp, TemplateJson, SampleContent, HeaderFile, CarouselCard } from './types';
import { 
    Plus, Trash2, Smartphone, Globe, MessageSquare, 
    FileText, Image as ImageIcon, Video, File, MapPin, 
    Type as TypeIcon, Layout, AlertCircle, CheckCircle, Code, Lock, Layers, Copy, X, ShoppingBag, Phone, Clock,
    Sparkles, Wand2, RefreshCw, Bot, Upload, ArrowRight, Link as LinkIcon, Download, Grid,
    Bold, Italic, Strikethrough, CornerDownLeft, Save, Cloud
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
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
    isViewOnly?: boolean;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ initialTemplateJson, isViewOnly = false }) => {
    const { user } = useAuthStore();
    
    // Core Info
    const [templateName, setTemplateName] = useState("");
    const [language, setLanguage] = useState("en_US");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMeta, setLoadingMeta] = useState(false);

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

    // Initialize form fields from initialTemplateJson when editing
    useEffect(() => {
        if (initialTemplateJson) {
            console.log('🔄 Initializing form from template data:', initialTemplateJson);
            
            // Set basic fields
            if (initialTemplateJson.name) setTemplateName(initialTemplateJson.name);
            if (initialTemplateJson.language) setLanguage(initialTemplateJson.language);
            if (initialTemplateJson.category) setCategory(initialTemplateJson.category);
            
            // Parse components to populate form fields
            const components = initialTemplateJson.components || [];
            
            components.forEach((comp: any) => {
                if (comp.type === 'HEADER') {
                    if (comp.format === 'TEXT') {
                        setHeaderType('TEXT');
                        setHeaderText(comp.text || '');
                    } else if (comp.format === 'IMAGE' || comp.format === 'VIDEO' || comp.format === 'DOCUMENT') {
                        setHeaderType(comp.format);
                    }
                }
                
                if (comp.type === 'BODY') {
                    setBodyText(comp.text || '');
                }
                
                if (comp.type === 'FOOTER') {
                    setFooterText(comp.text || '');
                }
                
                if (comp.type === 'BUTTONS' && comp.buttons) {
                    const parsedButtons = comp.buttons.map((btn: any, idx: number) => ({
                        id: idx + 1,
                        type: btn.type,
                        text: btn.text || '',
                        url: btn.url || '',
                        phone: btn.phone_number || '',
                        urlType: btn.url && btn.url.includes('{{1}}') ? 'dynamic' : 'static',
                        urlExample: btn.example ? btn.example[0] : '',
                        codeExample: btn.example || ''
                    }));
                    setButtons(parsedButtons);
                }
            });
            
            console.log('✅ Form initialized with template data');
        }
    }, [initialTemplateJson]);

    // --- AI GENERATION LOGIC ---
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
                 parts.push({ inlineData: { mimeType: imageGenRefImage.type, data: imageGenRefImage.data } });
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
                                category: { type: Type.STRING, enum: ["MARKETING", "UTILITY"] },
                                headerType: { type: Type.STRING, enum: ["NONE", "TEXT", "IMAGE", "VIDEO", "DOCUMENT"] },
                                headerText: { type: Type.STRING },
                                imagePrompt: { type: Type.STRING },
                                bodyText: { type: Type.STRING },
                                footerText: { type: Type.STRING },
                                buttons: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            type: { type: Type.STRING, enum: ["QUICK_REPLY", "URL", "PHONE_NUMBER", "COPY_CODE"] },
                                            text: { type: Type.STRING },
                                            url: { type: Type.STRING },
                                            phone: { type: Type.STRING }
                                        }
                                    }
                                }
                            },
                            required: ["variationName", "name", "category", "bodyText"]
                        }
                    }
                }
            };

            const modelParts: any[] = [];
            referenceImages.forEach(img => {
                modelParts.push({ inlineData: { mimeType: img.type, data: img.data } });
            });
            
            let fullPrompt = `Create 3 distinct WhatsApp Business Template variations based on this description: "${aiPrompt}". `;
            if (websiteContext) fullPrompt += `\n\nWebsite Context: ${websiteContext}`;
            if (referenceImages.length > 0) fullPrompt += `\n\nUse the attached images as visual reference.`;
            fullPrompt += `\n1. Professional/Formal.\n2. Friendly/Casual.\n3. Urgent/Action-Oriented.`;
            if (shouldGenerateAiImages) fullPrompt += `\n\nFor all variations, prefer 'IMAGE' headerType and provide detailed 'imagePrompt'.`;

            modelParts.push({ text: fullPrompt });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: modelParts },
                config: { responseMimeType: "application/json", responseSchema: schema }
            });

            const parsed = JSON.parse(response.text);
            const variations = parsed.variations || [];

            // Parallel Image Generation for Variations
            const variationsWithImages = await Promise.all(variations.map(async (v: any, idx: number) => {
                let generatedImageUrl = null;
                let usedRefImage = null;

                if (shouldGenerateAiImages && (v.headerType === 'IMAGE' || v.headerType === 'NONE')) {
                    try {
                        const imgPrompt = v.imagePrompt || aiPrompt || "A professional header image";
                        const imgParts: any[] = [];
                        
                        if (referenceImages.length > 0) {
                            const refIdx = idx % referenceImages.length;
                            const refImage = referenceImages[refIdx];
                            usedRefImage = refImage;
                            imgParts.push({ inlineData: { mimeType: refImage.type, data: refImage.data } });
                            imgParts.push({ text: `Create a high fidelity image based on this reference. ${imgPrompt}` });
                        } else {
                            imgParts.push({ text: imgPrompt });
                        }

                        // Use gemini-3-pro-image-preview for high resolution
                        await ensureApiKey();
                        const aiImage = new GoogleGenAI({ apiKey: process.env.API_KEY });
                        
                        const imgResponse = await aiImage.models.generateContent({
                            model: 'gemini-3-pro-image-preview',
                            contents: { parts: imgParts },
                            config: { imageConfig: { aspectRatio: "1:1", imageSize: "2K" } }
                        });
                        
                        for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
                            if (part.inlineData) {
                                generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                                break;
                            }
                        }
                    } catch (e) { console.error("Image gen failed", e); }
                }
                
                // Fallback to reference image if generation failed or not requested but ref exists
                if (!generatedImageUrl && usedRefImage) {
                    generatedImageUrl = `data:${usedRefImage.type};base64,${usedRefImage.data}`;
                }

                const updatedHeaderType = generatedImageUrl ? 'IMAGE' : v.headerType;
                return { ...v, headerType: updatedHeaderType, generatedImageUrl };
            }));

            setAiVariations(variationsWithImages);
        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("Failed to generate variations. Please try again.");
        } finally {
            setIsAiGenerating(false);
        }
    };

    const applyAiVariation = () => {
        const selected = aiVariations[selectedVariationIndex];
        if (!selected) return;

        setTemplateName(selected.name || "ai_generated_template");
        setCategory(selected.category || "MARKETING");
        setTemplateType("Default"); 
        
        const activeImage = manualImageOverride || selected.generatedImageUrl;
        if (activeImage) {
            setHeaderType("IMAGE");
            setHeaderFile({ url: activeImage, type: 'image/png' });
        } else {
            setHeaderType(selected.headerType || "NONE");
            setHeaderText(selected.headerText || "");
            setHeaderFile(null);
        }

        setBodyText(selected.bodyText || "");
        setFooterText(selected.footerText || "");
        
        if (selected.buttons && Array.isArray(selected.buttons)) {
            const newButtons: TemplateButton[] = selected.buttons.map((b: any, index: number) => {
                const isDynamicUrl = b.url?.includes("{{1}}");
                return {
                    id: Date.now() + index,
                    type: b.type,
                    text: b.text || "Button",
                    url: b.url || "",
                    phone: b.phone || "",
                    urlType: isDynamicUrl ? "dynamic" : "static",
                    urlExample: isDynamicUrl ? "sample" : ""
                };
            });
            setButtons(newButtons.slice(0, 10));
        } else {
            setButtons([]);
        }

        setIsAiMode(false);
        setSampleContents({});
        setHeaderSampleContents({});
        setReferenceImages([]);
        setWebsiteUrl("");
        setAiVariations([]);
        setManualImageOverride(null);
    };

    // --- TEMPLATE JSON EFFECT ---
    useEffect(() => {
        const componentsArr: any[] = [];
        const extractVarNum = (v: string) => v.match(/\d+/)?.[0] || '1';
        
        if (templateType === 'Carousel') {
            const bodyComp: any = { type: 'BODY', text: bodyText };
            const mainBodyVars = [...new Set(bodyText.match(/{{\d+}}/g) || [])];
            if (mainBodyVars.length > 0) {
                bodyComp.example = { body_text: [mainBodyVars.map(v => { const varNum = extractVarNum(v); return sampleContents[varNum] || `[Sample]`; })] };
            }
            componentsArr.push(bodyComp);

            const cards = carouselCards.map(card => {
                const cardComponents: any[] = [];
                const headerComp: any = { type: 'HEADER', format: carouselHeaderFormat };
                headerComp.example = { header_handle: ['https://scontent.whatsapp.net/v/t61.29466-34/1.jpg'] }; 
                cardComponents.push(headerComp);

                const cardBodyComp: any = { type: 'BODY', text: card.bodyText };
                const vars = [...new Set(card.bodyText.match(/{{\d+}}/g) || [])];
                if (vars.length > 0) {
                    cardBodyComp.example = { body_text: [vars.map(v => { const varNum = extractVarNum(v); return (varNum && card.sampleContents?.[varNum]) || `[Sample]`; })] };
                }
                cardComponents.push(cardBodyComp);

                if (buttons.length > 0) {
                    const cardButtons = buttons.map(def => {
                        const val = card.buttonValues[def.id] || {};
                        const btnJson: any = { type: def.type };
                        btnJson.text = val.text || def.text; 
                        if (def.type === 'URL') {
                            btnJson.url = def.url; 
                            if (def.urlType === 'dynamic') {
                                btnJson.url = def.url; 
                                if (val.urlExample) btnJson.example = [val.urlExample];
                                else if (def.urlExample) btnJson.example = [def.urlExample]; 
                            }
                        }
                        if (def.type === 'PHONE_NUMBER') btnJson.phone_number = def.phone; 
                        return btnJson;
                    });
                    cardComponents.push({ type: 'BUTTONS', buttons: cardButtons });
                }
                return { components: cardComponents };
            });
            componentsArr.push({ type: 'CAROUSEL', cards: cards });

        } else {
            if (templateType === 'Catalog' && catalogFormat === 'Multi-product message') {
                const headerComp: any = { type: 'HEADER', format: 'TEXT', text: headerText };
                 const headerVars = [...new Set(headerText.match(/{{\d+}}/g) || [])] as string[];
                if (headerVars.length > 0) headerComp.example = { header_text: headerVars.map(v => { const varNum = v.match(/\d+/)?.[0]; return (varNum && headerSampleContents[varNum]) || `[Sample]`; }) };
                componentsArr.push(headerComp);
            } else if (headerType !== 'NONE' && templateType !== 'Catalog' && templateType !== 'Calling permissions request') {
                const headerComp: any = { type: 'HEADER', format: headerType.toUpperCase() };
                if (headerType === 'TEXT') {
                    headerComp.text = headerText;
                    const headerVars = [...new Set(headerText.match(/{{\d+}}/g) || [])] as string[];
                    if (headerVars.length > 0) headerComp.example = { header_text: headerVars.map(v => { const varNum = v.match(/\d+/)?.[0]; return (varNum && headerSampleContents[varNum]) || `[Sample]`; }) };
                } else if (headerType !== 'LOCATION') {
                    headerComp.example = { header_handle: ['https://www.example.com/media.png'] };
                }
                componentsArr.push(headerComp);
            }

            const bodyComp: any = { type: 'BODY' };
            if (category === 'AUTHENTICATION') {
                if (addSecurityRecommendation) bodyComp.add_security_recommendation = true;
            } else {
                // Only add text if bodyText is not empty
                if (bodyText && bodyText.trim()) {
                    bodyComp.text = bodyText;
                    const vars = [...new Set(bodyText.match(/{{\d+}}/g) || [])];
                    if (vars.length > 0) bodyComp.example = { body_text: [vars.map(v => { const varNum = v.match(/\d+/)?.[0]; return (varNum && sampleContents[varNum]) || `[Sample]`; })] };
                }
            }
            componentsArr.push(bodyComp);

            if (footerText) componentsArr.push({ type: 'FOOTER', text: footerText });
            else if (category === 'AUTHENTICATION' && addExpiry) componentsArr.push({ type: 'FOOTER', code_expiration_minutes: expiryMinutes });

            if (templateType === 'Catalog') {
                const btn = catalogFormat === 'Catalog message' ? { type: 'CATALOG', text: 'View catalog' } : { type: 'MPM', text: 'View items' };
                componentsArr.push({ type: 'BUTTONS', buttons: [btn] });
            } else if (templateType === 'Calling permissions request') {
                componentsArr.push({ type: 'CALL_PERMISSION_REQUEST' });
            } else if (category === 'AUTHENTICATION') {
                const otpBtn: any = { type: 'OTP', otp_type: authType, text: copyCodeText };
                if (authType !== 'COPY_CODE') {
                    otpBtn.autofill_text = autofillText;
                    otpBtn.supported_apps = supportedApps.filter(app => app.package_name && app.signature_hash).map(({ package_name, signature_hash }) => ({ package_name, signature_hash }));
                    if (authType === 'ZERO_TAP' && zeroTapConsent) otpBtn.zero_tap_terms_accepted = true;
                }
                componentsArr.push({ type: 'BUTTONS', buttons: [otpBtn] });
            } else if (buttons.length > 0) {
                const apiBtns = buttons.map(b => {
                    const base: any = { type: b.type };
                    if (b.type === 'COPY_CODE') base.example = b.codeExample || 'CODE123';
                    else base.text = b.text;

                    if (b.type === 'URL') {
                        base.url = b.url;
                        if (b.urlType === 'dynamic' && b.urlExample) base.example = [b.urlExample];
                    }
                    if (b.type === 'PHONE_NUMBER') base.phone_number = b.phone;
                    return base;
                });
                componentsArr.push({ type: 'BUTTONS', buttons: apiBtns });
            }
        }

        const finalJson: any = { name: templateName.toLowerCase().replace(/\s+/g, '_'), language: language, category: category, components: componentsArr };
        if (addValidityPeriod) finalJson.message_send_ttl_seconds = validityPeriodSeconds;
        setTemplateJson(finalJson);

        // --- Send Message JSON Construction ---
        const sendComponents: any[] = [];
        
        if (category === 'AUTHENTICATION') {
            const authBodyParams = ([...new Set(bodyText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: sampleContents[extractVarNum(v)] || '[Sample Code]' }));
            if (authBodyParams.length > 0) sendComponents.push({ type: 'body', parameters: authBodyParams });
            sendComponents.push({ type: 'button', sub_type: 'otp', index: '0', parameters: [{ type: 'text', text: sampleContents['1'] || '[Sample Code]' }] });
        } else if (templateType === 'Catalog') {
             if (catalogFormat === 'Multi-product message') {
                 if (/{{\d+}}/.test(headerText)) {
                    const headerParams = ([...new Set(headerText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: headerSampleContents[extractVarNum(v)] || '[Sample Header]' }));
                    sendComponents.push({ type: 'header', parameters: headerParams });
                 }
                 if (/{{\d+}}/.test(bodyText)) {
                    const bodyParams = ([...new Set(bodyText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: sampleContents[extractVarNum(v)] || '[Sample Body]' }));
                    sendComponents.push({ type: 'body', parameters: bodyParams });
                 }
                 sendComponents.push({ type: 'button', sub_type: 'mpm', index: 0, parameters: [{ type: 'action', action: { thumbnail_product_retailer_id: '<THUMBNAIL_PRODUCT_RETAILER_ID>', sections: [{ title: 'Featured Items', product_items: [{ product_retailer_id: '<product_id_1>' }, { product_retailer_id: '<product_id_2>' }] }] } }] });
            } else {
                if (/{{\d+}}/.test(bodyText)) {
                    const bodyParams = ([...new Set(bodyText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: sampleContents[extractVarNum(v)] || '[Sample Body]' }));
                    sendComponents.push({ type: 'body', parameters: bodyParams });
                }
                sendComponents.push({ type: 'button', sub_type: 'catalog', index: 0, parameters: [{ type: 'action', action: { thumbnail_product_retailer_id: '<THUMBNAIL_PRODUCT_RETAILER_ID>' } }] });
            }
        } else if (templateType === 'Carousel') {
             if (/{{\d+}}/.test(bodyText)) {
                const bodyParams = ([...new Set(bodyText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: sampleContents[extractVarNum(v)] || '[Sample Body]' }));
                sendComponents.push({ type: 'body', parameters: bodyParams });
            }
            const carouselCardsSend = carouselCards.map((card, idx) => {
                const cardParams = [];
                if (carouselHeaderFormat === 'IMAGE') cardParams.push({ type: 'header', parameters: [{ type: 'image', image: { link: "https://picsum.photos/200/300" } }] });
                else cardParams.push({ type: 'header', parameters: [{ type: 'video', video: { link: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" } }] });
                if (/{{\d+}}/.test(card.bodyText)) {
                    const bodyParams = ([...new Set(card.bodyText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: card.sampleContents?.[extractVarNum(v)] || '[Sample]' }));
                    cardParams.push({ type: 'body', parameters: bodyParams });
                }
                buttons.forEach((btn, btnIdx) => {
                    const val = card.buttonValues[btn.id] || {};
                    if (btn.type === 'QUICK_REPLY') {
                         cardParams.push({ type: 'button', sub_type: 'quick_reply', index: btnIdx.toString(), parameters: [{ type: 'payload', payload: `${idx}_${btnIdx}_payload` }] });
                    }
                    if (btn.type === 'URL' && btn.urlType === 'dynamic') {
                         cardParams.push({ type: 'button', sub_type: 'url', index: btnIdx.toString(), parameters: [{ type: 'text', text: val.urlExample || btn.urlExample || 'sample' }] });
                    }
                });
                return { card_index: idx, components: cardParams };
            });
            sendComponents.push({ type: 'carousel', cards: carouselCardsSend });
        } else if (templateType !== 'Catalog') {
             if (headerType === 'TEXT' && /{{\d+}}/.test(headerText)) {
                const headerParams = ([...new Set(headerText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: headerSampleContents[extractVarNum(v)] || '[Sample]' }));
                sendComponents.push({ type: 'header', parameters: headerParams });
            } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType)) {
                const activeLink = (headerFile && headerFile.url) || headerExistingMediaLink || "https://example.com/media";
                let mediaParam = null;
                if (headerType === 'IMAGE') mediaParam = { type: 'image', image: { link: activeLink } };
                else if (headerType === 'VIDEO') mediaParam = { type: 'video', video: { link: activeLink } };
                else mediaParam = { type: 'document', document: { link: activeLink } };
                sendComponents.push({ type: 'header', parameters: [mediaParam] });
            }
            if (/{{\d+}}/.test(bodyText)) {
                const bodyParams = ([...new Set(bodyText.match(/{{\d+}}/g) || [])] as string[]).map(v => ({ type: 'text', text: sampleContents[extractVarNum(v)] || '[Sample]' }));
                sendComponents.push({ type: 'body', parameters: bodyParams });
            }
            buttons.forEach((btn, index) => {
                if (btn.type === 'URL' && btn.urlType === 'dynamic') {
                    sendComponents.push({ type: 'button', sub_type: 'url', index: index.toString(), parameters: [{ type: 'text', text: btn.urlExample || 'sample' }] });
                }
                if (btn.type === 'QUICK_REPLY') {
                    sendComponents.push({ type: 'button', sub_type: 'quick_reply', index: index.toString(), parameters: [{ type: 'payload', payload: 'button_payload_' + index }] });
                }
            });
        }
        
        const sendJson = { messaging_product: 'whatsapp', to: '<recipient_phone_number>', type: 'template', template: { name: finalJson.name, language: { code: language }, components: sendComponents } };
        setSendMessageJson(sendJson);

    }, [templateName, language, category, templateType, catalogFormat, headerType, headerText, bodyText, footerText, buttons, authType, addSecurityRecommendation, addExpiry, expiryMinutes, sampleContents, headerSampleContents, supportedApps, autofillText, copyCodeText, addValidityPeriod, validityPeriodSeconds, headerFile, headerExistingMediaLink, carouselCards, carouselHeaderFormat]);

    // Reset Form on Category Change
    useEffect(() => {
        setBodyText(category === "AUTHENTICATION" ? "{{1}} is your verification code." : "");
        setFooterText("");
        setHeaderText("");
        setHeaderType("NONE");
        setButtons([]);
        setSampleContents({});
        setHeaderFile(null);
        setHeaderSampleContents({});
        setAuthType("COPY_CODE");
        setAddSecurityRecommendation(false);
        setAddExpiry(false);
        setAddValidityPeriod(false);
        setSupportedApps([{ id: 0, package_name: '', signature_hash: '' }]);
        setZeroTapConsent(false);
        setCarouselCards([{ id: 1, bodyText: "", buttonValues: {}, sampleContents: {} }, { id: 2, bodyText: "", buttonValues: {}, sampleContents: {} }]);
        setSelectedCardIndex(0);

        if (category === "AUTHENTICATION") {
            setTemplateType("One-time Passcode");
            setCatalogFormat("Catalog message");
        } else if (category === "MARKETING") {
            setTemplateType("Default");
            setCatalogFormat("Catalog message");
        } else if (category === "UTILITY") {
            setTemplateType("Default");
            setCatalogFormat("Catalog message");
        }
    }, [category]);

    useEffect(() => {
        if (templateType === 'Carousel') {
             setButtons(prev => {
                 const validButtons = prev.filter(b => b.type !== 'COPY_CODE');
                 if (validButtons.length > 2) return validButtons.slice(0, 2);
                 return validButtons;
             });
        } else if (templateType === 'Catalog' || templateType === 'Calling permissions request') {
            setButtons([]);
        }
    }, [templateType]);

    useEffect(() => {
        if (templateType === 'Catalog') {
            if (catalogFormat === 'Multi-product message') setHeaderType('TEXT');
            else setHeaderType('NONE');
        }
    }, [templateType, catalogFormat]);

    const handleAddApp = () => { if (supportedApps.length < 5) { appIdCounter++; setSupportedApps(prev => [...prev, { id: appIdCounter, package_name: '', signature_hash: '' }]); } else { alert("A maximum of 5 apps is allowed."); } };
    const handleRemoveApp = (id: number) => setSupportedApps(prev => prev.filter(app => app.id !== id));
    const handleAppChange = (id: number, field: keyof SupportedApp, value: string) => setSupportedApps(prev => prev.map(app => app.id === id ? { ...app, [field]: value } : app));
    
    const validatePackageName = (pkg: string) => {
        if (!pkg) return false;
        const segments = pkg.split('.');
        if (segments.length < 2) return false;
        const segRe = /^[A-Za-z][A-Za-z0-9_]*$/;
        return segments.every(s => segRe.test(s));
    };
    
    const validateSignatureHash = (hash: string) => hash && hash.length === 11;

    const handleRemoveButton = (id: number) => setButtons(prev => prev.filter(btn => btn.id !== id));
    const handleButtonChange = (id: number, field: string, value: string) => setButtons(prev => prev.map(btn => btn.id === id ? { ...btn, [field]: value } : btn));
    
    const handleAddButton = (type: TemplateButton['type']) => {
        buttonIdCounter++;
        const newButton: TemplateButton = { id: buttonIdCounter, type, text: '', url: '', phone: '' };
        if (type === 'URL') { newButton.urlType = 'static'; newButton.urlExample = ''; }
        if (type === 'COPY_CODE') {
             if (buttons.some(b => b.type === 'COPY_CODE')) return alert("Only one Copy Code button is allowed.");
             if (templateType === 'Carousel') return alert("Copy Code buttons are not supported in Carousel templates.");
        }
        setButtons(prev => {
            const limit = templateType === 'Carousel' ? 2 : 10;
            if (prev.length >= limit) { 
                alert(`A maximum of ${limit} buttons is allowed.`); 
                return prev; 
            }
            return [...prev, newButton];
        });
    };

    const handleAddCard = () => {
        if (carouselCards.length >= 10) return alert("Max 10 cards.");
        cardIdCounter++;
        setCarouselCards(prev => {
            const newCards = [...prev, { id: Date.now(), bodyText: "", buttonValues: {}, sampleContents: {} }];
            setSelectedCardIndex(newCards.length - 1); 
            return newCards;
        });
    };

    const handleRemoveCard = (index: number) => {
        if (carouselCards.length <= 1) return alert("At least 1 card required.");
        setCarouselCards(prev => {
            const newCards = prev.filter((_, i) => i !== index);
            if (selectedCardIndex >= newCards.length) setSelectedCardIndex(newCards.length - 1);
            else if (selectedCardIndex === index) setSelectedCardIndex(Math.max(0, index - 1));
            return newCards;
        });
    };

    const handleCardBodyChange = (index: number, text: string) => {
        setCarouselCards(prev => {
            const newCards = [...prev];
            newCards[index] = { ...newCards[index], bodyText: text };
            return newCards;
        });
    };

    const handleCardSampleChange = (index: number, varNum: string, val: string) => {
        setCarouselCards(prev => {
            const newCards = [...prev];
            newCards[index] = { ...newCards[index], sampleContents: { ...newCards[index].sampleContents, [varNum]: val } };
            return newCards;
        });
    };

    const handleCardFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setCarouselCards(prev => {
                        const newCards = [...prev];
                        newCards[index] = { ...newCards[index], headerFile: { url: e.target?.result as string, type: file.type } };
                        return newCards;
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCardButtonValueChange = (cardIndex: number, btnId: number, field: 'text' | 'urlExample', value: string) => {
        setCarouselCards(prev => {
            const newCards = [...prev];
            const currentVals = newCards[cardIndex].buttonValues[btnId] || {};
            newCards[cardIndex].buttonValues[btnId] = { ...currentVals, [field]: value };
            return newCards;
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setHeaderFile({ url: e.target.result as string, type: file.type });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validateButtonGrouping = (types: string[]) => {
        if (!types || types.length === 0) return true;
        if (types.length > 10) return false;
        const mapped = types.map(t => t === 'QUICK_REPLY' ? 'QR' : 'ACTION');
        const collapsed = mapped.reduce<string[]>((acc, cur) => {
            if (acc.length === 0 || acc[acc.length - 1] !== cur) acc.push(cur);
            return acc;
        }, []);
        return collapsed.length <= 2;
    };

    const validateForm = () => {
        // Validate template name
        if (!templateName || templateName.trim() === '') {
            alert('Error: Template name is required.');
            return false;
        }
        
        // Validate body text (required for most categories except AUTHENTICATION)
        if (category !== 'AUTHENTICATION' && (!bodyText || bodyText.trim() === '')) {
            alert('Error: Body text is required. Please enter message content.');
            return false;
        }
        
        // Validate buttons
        for (const btn of buttons) {
            if (btn.type === 'URL' && btn.urlType === 'dynamic' && !btn.url?.includes('{{1}}')) {
                alert(`Error for button "${btn.text || 'Untitled'}": A dynamic URL must contain the placeholder {{1}}.`);
                return false;
            }
        }
        return true;
    };

    const handleSaveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const payload = {
                template: templateJson,
                send_message: sendMessageJson,
                user_id: user?.id || 'anonymous',
                user_email: user?.email || '',
                user_role: user?.role || 'user'
            };

            const response = await fetch('http://localhost:8080/template/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Template saved to database:', data);
            
            alert('Template saved to database successfully!');
        } catch (error) {
            console.error('Error saving template:', error);
            alert(`Failed to save template: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndCreateMeta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoadingMeta(true);
        try {
            const payload = {
                template: templateJson,
                send_message: sendMessageJson,
                user_id: user?.id || 'anonymous',
                user_email: user?.email || '',
                user_role: user?.role || 'user'
            };

            const response = await fetch('http://localhost:8080/template/save-and-submit-meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (!response.ok) {
                // Handle partial success (saved to DB but failed to submit to Meta)
                if (response.status === 206) { // Partial Content
                    console.warn('Template saved to database but failed to submit to Meta:', data);
                    alert(`Template saved to database but failed to submit to Meta: ${data.error || 'Unknown error'}`);
                } else {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }
                return;
            }

            console.log('Template saved and submitted to Meta:', data);
            alert(`Template saved to database and created in Meta successfully! Meta Template ID: ${data.meta_template_id}`);
            
        } catch (error) {
            console.error('Error saving and submitting template:', error);
            alert(`Failed to save and submit template: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoadingMeta(false);
        }
    };

    // Keep original handleSubmit for form onSubmit (will use Save as Draft)

    const handleSubmit = handleSaveTemplate;

    const anyAppInvalid = supportedApps.some(app => !(validatePackageName(app.package_name) && validateSignatureHash(app.signature_hash)));
    const groupingValid = templateType === 'Default' ? validateButtonGrouping(buttons.map(b => b.type)) : true;
    const carouselInvalid = templateType === 'Carousel' && carouselCards.some(c => !c.bodyText || c.bodyText.trim().length === 0);
    const isSubmitDisabled = (loading || loadingMeta) || !category || !templateName || !templateName.trim() || (category === 'AUTHENTICATION' && authType === 'ZERO_TAP' && !zeroTapConsent) || ((authType === 'ONE_TAP' || authType === 'ZERO_TAP') && anyAppInvalid) || !groupingValid || carouselInvalid;
    const variablesInBody = [...new Set(bodyText.match(/{{\d+}}/g) || [])];
    const variablesInHeader = [...new Set(headerText.match(/{{\d+}}/g) || [])];

    const getAcceptType = (type = headerType) => {
        switch(type) {
            case 'IMAGE': return 'image/*';
            case 'VIDEO': return 'video/*';
            case 'DOCUMENT': return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
            default: return '';
        }
    };

    const activeCard = carouselCards[selectedCardIndex] || carouselCards[0];
    
    // --- LIVE PREVIEW DATA CONSTRUCTION ---
    let activePreviewComponents = templateJson.components || [];
    let activePreviewCategory = category;
    let activePreviewHeaderFile = headerFile;

    if (isAiMode && aiVariations.length > 0) {
        const v = aiVariations[selectedVariationIndex];
        if (v) {
            activePreviewCategory = v.category || "MARKETING";
            const previewComps: any[] = [];
            const activeImage = manualImageOverride || v.generatedImageUrl;
            const effectiveHeaderType = activeImage ? 'IMAGE' : (v.headerType !== 'NONE' ? v.headerType : 'NONE');

            if (effectiveHeaderType !== 'NONE') {
                const headerComp: any = { type: 'HEADER', format: effectiveHeaderType };
                if (effectiveHeaderType === 'TEXT') headerComp.text = v.headerText || "";
                else headerComp.example = { header_handle: ['mock_handle'] };
                previewComps.push(headerComp);
                if (activeImage) activePreviewHeaderFile = { url: activeImage, type: 'image' };
                else activePreviewHeaderFile = null;
            } else {
                activePreviewHeaderFile = null;
            }
            
            previewComps.push({ type: 'BODY', text: v.bodyText });
            if (v.footerText) previewComps.push({ type: 'FOOTER', text: v.footerText });
            if (v.buttons && v.buttons.length > 0) previewComps.push({ type: 'BUTTONS', buttons: v.buttons });
            activePreviewComponents = previewComps;
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans">
            {/* Glassmorphism Header */}
            <header
                className="
                    px-4 md:px-8 pt-4 md:pt-6 pb-4
                    sticky top-0 z-50
                    shadow-sm
                    bg-white/40
                    backdrop-blur-md
                    border-b border-slate-200/60
                    transition-all mb-3
                "
                style={{
                    background: 'rgba(255,255,255,0.40)',
                    WebkitBackdropFilter: 'blur(20px)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left Side: Title */}

                        <div className="flex items-center gap-3 pl-2">
                            <MessageSquare className="text-emerald-500 w-7 h-7" />
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">
                                    {initialTemplateJson ? 'Edit Template' : 'Create New Template'}
                                </h1>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    {initialTemplateJson ? 'Modify your WhatsApp message template' : 'Build your WhatsApp message template'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Right Side: All Buttons in One Line */}
                        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                            <div className="flex items-center  gap-20 flex-shrink-0">
                            {/* Mode Toggle Button */}
                            {/* <div className="flex-shrink-0 mr-10 lg:ml-12"> */}
                                {isAiMode ? (
                                    <button 
                                        onClick={() => setIsAiMode(false)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer text-sm"
                                    >
                                        <Layout size={16} />
                                        <span className="font-medium">Manual Builder</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsAiMode(true)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:from-violet-600 hover:to-fuchsia-600 transition-all cursor-pointer text-sm"
                                    >
                                        <Bot size={16} />
                                        <span className="font-medium">Generate with AI</span>
                                    </button>
                                )}
                            {/* </div> */}
                            
                            {/* Responsive spacer - smaller now */}
                            {/* <div className="hidden lg:block w-20 ml-4 mr-4 xl:w-12"></div> */}
                           
                            {/* Save Buttons - Hide in view-only mode */}
                            {!isViewOnly && (
                                <>
                                    <button 
                                        type="button"
                                        onClick={handleSaveTemplate}
                                        disabled={isSubmitDisabled} 
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                                            isSubmitDisabled 
                                            ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30'
                                        }`}
                                    >
                                        <Save size={16} />
                                        {loading ? 'Saving...' : 'Save as Draft'}
                                    </button>
                                    
                                    <button 
                                        type="button"
                                        onClick={handleSaveAndCreateMeta}
                                        disabled={isSubmitDisabled} 
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                                            isSubmitDisabled 
                                            ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-500/30'
                                        }`}
                                    >
                                        <Cloud size={16} />
                                        {loadingMeta ? 'Creating...' : 'Submit to Meta'}
                                    </button>
                                </>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 md:px-8 pb-8 w-full">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Form Editor */}
                    <div className="lg:w-8/12 space-y-6">
                
                {/* --- MODE SWITCHER: MANUAL vs AI --- */}
                {/* <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex gap-2">
                    <button 
                        onClick={() => { setIsAiMode(false); setAiVariations([]); }}
                        className={clsx(
                            "flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-lg font-bold transition-all relative",
                            !isAiMode ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Layout size={18}/> Manual Builder
                        </div>
                        <span className={clsx(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            !isAiMode ? "bg-slate-200 text-slate-600" : "bg-slate-100 text-slate-400"
                        )}>
                            Step-by-Step
                        </span>
                    </button>
                    <button 
                        onClick={() => setIsAiMode(true)}
                        className={clsx(
                            "flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-lg font-bold transition-all relative",
                            isAiMode ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={18}/> Generate with AI
                        </div>
                        <span className={clsx(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            isAiMode ? "bg-white/20 text-white/80" : "bg-slate-100 text-slate-400"
                        )}>
                            AI-Powered
                        </span>
                    </button>
                </div> */}

                {isAiMode ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-violet-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 border-b border-violet-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-violet-600"><Bot size={24}/></div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">AI Template Assistant</h3>
                                    <p className="text-sm text-slate-600">
                                        {aiVariations.length > 0 ? "Select a variation to see it in the preview." : "Describe what you need, and I'll build 3 variations for you."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* INPUT STAGE */}
                        {aiVariations.length === 0 ? (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Description</label>
                                    <textarea
                                        className="w-full p-4 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all resize-none text-slate-700"
                                        rows={4}
                                        placeholder="E.g., A friendly summer sale announcement for a clothing store offering 50% off with a discount code button."
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Website / Business URL (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={16}/></div>
                                        <input 
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-slate-700"
                                            placeholder="https://www.yourbusiness.com"
                                            value={websiteUrl}
                                            onChange={(e) => setWebsiteUrl(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">AI will analyze this site to match your brand tone and products.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Reference Images (Max 3)</label>
                                    <div className="flex flex-wrap gap-3">
                                        {referenceImages.map((img, idx) => (
                                            <div key={idx} className="h-20 w-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 relative group">
                                                <img src={`data:${img.type};base64,${img.data}`} alt="Ref" className="h-full w-full object-cover" />
                                                <button 
                                                    onClick={() => removeReferenceImage(idx)}
                                                    className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12}/>
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {referenceImages.length < 3 && (
                                            <label className="h-20 w-20 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center text-slate-400">
                                                <Upload size={20} />
                                                <span className="text-[10px] mt-1">Upload</span>
                                                <input type="file" className="hidden" onChange={handleReferenceImagesChange} accept="image/*" multiple />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-lg border border-violet-100">
                                    <input 
                                        type="checkbox" 
                                        id="gen_images"
                                        checked={shouldGenerateAiImages}
                                        onChange={e => setShouldGenerateAiImages(e.target.checked)}
                                        className="w-5 h-5 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
                                    />
                                    <label htmlFor="gen_images" className="text-sm font-medium text-slate-700 cursor-pointer select-none flex-1">
                                        Generate Header Images with AI
                                        <span className="block text-xs text-slate-500 font-normal">If checked, AI will create 3 unique images (2K Resolution) which you can swap between templates.</span>
                                    </label>
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        onClick={() => { setIsAiMode(false); }}
                                        className="px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={generateTemplateWithAI}
                                        disabled={isAiGenerating || (!aiPrompt.trim() && !websiteUrl.trim())}
                                        className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isAiGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Wand2 size={20}/>}
                                        {isAiGenerating ? 'Analyzing & Generating...' : 'Generate Variations'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // SELECTION STAGE
                            <div className="p-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">1. Select Content Variation</h4>
                                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                                    {aiVariations.map((v, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { setSelectedVariationIndex(idx); setManualImageOverride(null); }}
                                            className={clsx(
                                                "min-w-[200px] flex-1 p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2 relative",
                                                selectedVariationIndex === idx 
                                                    ? "border-violet-500 bg-violet-50 shadow-md ring-2 ring-violet-200" 
                                                    : "border-slate-100 bg-white hover:border-violet-200"
                                            )}
                                        >
                                            <div className="font-bold text-slate-800">{v.variationName || `Variation ${idx + 1}`}</div>
                                            <div className="text-xs text-slate-500 line-clamp-3">{v.bodyText}</div>
                                            {selectedVariationIndex === idx && <div className="absolute top-2 right-2 text-violet-600"><CheckCircle size={16}/></div>}
                                        </button>
                                    ))}
                                </div>

                                {/* IMAGE GALLERY - Mix & Match */}
                                {aiVariations.some(v => v.generatedImageUrl) && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            2. Select Image <span className="text-xs font-normal text-slate-400 normal-case">(Click to swap image for current variation)</span>
                                        </h4>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {aiVariations.map((v, idx) => v.generatedImageUrl ? (
                                                <button
                                                    key={idx}
                                                    onClick={() => setManualImageOverride(v.generatedImageUrl)}
                                                    className={clsx(
                                                        "relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all group",
                                                        (manualImageOverride === v.generatedImageUrl || (!manualImageOverride && selectedVariationIndex === idx)) 
                                                            ? "border-emerald-500 ring-2 ring-emerald-500/30" 
                                                            : "border-slate-200 hover:border-violet-300"
                                                    )}
                                                >
                                                    <img src={v.generatedImageUrl} alt={`Var ${idx}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                                    {(manualImageOverride === v.generatedImageUrl || (!manualImageOverride && selectedVariationIndex === idx)) && (
                                                        <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5"><CheckCircle size={12}/></div>
                                                    )}
                                                </button>
                                            ) : null)}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg mb-4 flex gap-2">
                                    <Smartphone size={16} className="shrink-0 mt-0.5" />
                                    Check the phone preview on the right to see the selected combination.
                                </div>

                                <div className="flex justify-between pt-2">
                                    <button 
                                        onClick={() => { setAiVariations([]); }}
                                        className="text-sm text-slate-500 hover:text-slate-800 underline"
                                    >
                                        Start Over
                                    </button>
                                    <button 
                                        onClick={applyAiVariation}
                                        className="px-8 py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                                    >
                                        Apply This Variation <ArrowRight size={18}/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
                        {/* 1. Core Configuration */}
                        <FormSection title="Template Details" icon={Layout} description="Basic information about your template">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                                    <select required value={category} onChange={e => setCategory(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                                        <option value="" disabled>Select Category...</option>
                                        <option value="MARKETING">Marketing</option>
                                        <option value="UTILITY">Utility</option>
                                        <option value="AUTHENTICATION">Authentication</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Template Name *</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g., summer_sale_2024" 
                                        value={templateName} 
                                        onChange={(e) => {
                                            // Auto-convert to lowercase and replace spaces with underscores
                                            const value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                            setTemplateName(value);
                                        }}
                                        required 
                                        maxLength={512}
                                        className="block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        pattern="[a-z0-9_]+"
                                        title="Template name must be lowercase letters, numbers, and underscores only"
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-slate-500"> Lowercase, alphanumeric characters and underscores only.</p>
                                        <span className="text-xs text-slate-400">{templateName.length}/512</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Language *</label>
                                    <select value={language} onChange={e => setLanguage(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                                        <option value="en_US">English (US)</option>
                                        <option value="es">Spanish</option>
                                    </select>
                                </div>
                                
                                {category && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Template Type</label>
                                        <select value={templateType} onChange={e => setTemplateType(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                                            {category === 'MARKETING' && (<><option value="Default">Standard</option><option value="Catalog">Catalog</option><option value="Carousel">Carousel</option><option value="Calling permissions request">Calling permissions request</option></>)}
                                            {category === 'UTILITY' && (<><option value="Default">Standard</option><option value="Calling permissions request">Calling permissions request</option></>)}
                                            {category === 'AUTHENTICATION' && (<option value="One-time Passcode">One-time Passcode</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        {/* === CATALOG BUILDER === */}
                        {templateType === 'Catalog' && (
                            <FormSection title="Catalog Configuration" icon={ShoppingBag} description="Select the format for your catalog message.">
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input type="radio" name="catalogFormat" value="Catalog message" checked={catalogFormat === 'Catalog message'} onChange={e => setCatalogFormat(e.target.value)} className="mt-1 text-emerald-600 focus:ring-emerald-500" />
                                        <div>
                                            <div className="font-semibold text-slate-800">Single Product Message (SPM)</div>
                                            <div className="text-xs text-slate-500 mt-1">Displays a thumbnail and a "View catalog" button. Links to your entire store. Good for general awareness.</div>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input type="radio" name="catalogFormat" value="Multi-product message" checked={catalogFormat === 'Multi-product message'} onChange={e => setCatalogFormat(e.target.value)} className="mt-1 text-emerald-600 focus:ring-emerald-500" />
                                        <div>
                                            <div className="font-semibold text-slate-800">Multi-Product Message (MPM)</div>
                                            <div className="text-xs text-slate-500 mt-1">Displays items organized in sections. Requires a text header. Good for curated collections.</div>
                                        </div>
                                    </label>
                                </div>
                            </FormSection>
                        )}

                        {/* === CAROUSEL BUILDER === */}
                        {templateType === 'Carousel' && (
                            <>
                                {/* Carousel Configuration */}
                                <FormSection title="Carousel Setup" icon={Layers} description="Configure global settings and buttons for all cards.">
                                    <div className="space-y-6">
                                        {/* Main Body Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Main Message Content</label>
                                            <RichTextEditor 
                                                value={bodyText} 
                                                onChange={setBodyText} 
                                                rows={3}
                                                maxLength={1024}
                                                placeholder="Enter the main message that appears above the carousel cards..."
                                            />
                                            {variablesInBody.length > 0 && (
                                                <div className="mt-3 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                                                    <p className="text-xs font-semibold text-emerald-800 mb-2">Main Body Sample Content</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {variablesInBody.map(v => {
                                                            const num = v.match(/\d+/)?.[0] || '1';
                                                            return (
                                                                <div key={num}>
                                                                    <label className="text-xs font-medium text-emerald-700 block mb-1">{`{{${num}}}`}</label>
                                                                    <input 
                                                                        className="w-full text-sm px-2 py-1.5 rounded border border-emerald-200 focus:border-emerald-500 outline-none"
                                                                        placeholder={`Example content`}
                                                                        value={sampleContents[num] || ''}
                                                                        onChange={e => setSampleContents({...sampleContents, [num]: e.target.value})}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Header Type (All Cards)</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                                                    <input type="radio" checked={carouselHeaderFormat === 'IMAGE'} onChange={() => setCarouselHeaderFormat('IMAGE')} className="text-emerald-600 focus:ring-emerald-500" /> 
                                                    <div className="flex items-center gap-2"><ImageIcon size={16}/> <span className="text-sm font-medium">Image</span></div>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                                                    <input type="radio" checked={carouselHeaderFormat === 'VIDEO'} onChange={() => setCarouselHeaderFormat('VIDEO')} className="text-emerald-600 focus:ring-emerald-500" /> 
                                                    <div className="flex items-center gap-2"><Video size={16}/> <span className="text-sm font-medium">Video</span></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-semibold text-slate-700">Carousel Buttons</label>
                                                <span className="text-xs text-slate-500">{buttons.length}/2 (Max 2)</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-3">Buttons defined here appear on <strong>every</strong> card. You can customize the specific text/links in the Card Editor.</p>
                                            
                                            <div className="space-y-3 mb-3">
                                                {buttons.map((btn, idx) => (
                                                    <div key={btn.id} className="p-3 bg-slate-50 border rounded flex justify-between items-center">
                                                        <span className="text-sm font-medium">{btn.type.replace('_', ' ')} Button</span>
                                                        <button type="button" onClick={() => handleRemoveButton(btn.id)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16}/></button>
                                                    </div>
                                                ))}
                                                {buttons.length === 0 && <p className="text-sm italic text-slate-400">No buttons added.</p>}
                                            </div>

                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => handleAddButton('QUICK_REPLY')} disabled={buttons.length>=2} className="flex-1 py-2 text-sm border rounded hover:bg-slate-50 disabled:opacity-50">+ Quick Reply</button>
                                                <button type="button" onClick={() => handleAddButton('URL')} disabled={buttons.length>=2} className="flex-1 py-2 text-sm border rounded hover:bg-slate-50 disabled:opacity-50">+ URL</button>
                                                <button type="button" onClick={() => handleAddButton('PHONE_NUMBER')} disabled={buttons.length>=2} className="flex-1 py-2 text-sm border rounded hover:bg-slate-50 disabled:opacity-50">+ Phone</button>
                                            </div>

                                            {buttons.map((btn) => (
                                                btn.type === 'URL' ? (
                                                    <div key={btn.id} className="mt-3 p-3 border rounded bg-slate-50">
                                                        <label className="text-xs font-semibold block mb-1">Configure URL Button (Global)</label>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            <select value={btn.urlType} onChange={e => handleButtonChange(btn.id, 'urlType', e.target.value)} className="col-span-1 text-sm border rounded p-2">
                                                                <option value="static">Static</option>
                                                                <option value="dynamic">Dynamic</option>
                                                            </select>
                                                            <div className="col-span-2 relative">
                                                                <input 
                                                                    className="w-full text-sm border rounded p-2"
                                                                    placeholder={btn.urlType === 'dynamic' ? "https://www.site.com/{{1}}" : "https://www.site.com"}
                                                                    value={btn.url}
                                                                    onChange={e => handleButtonChange(btn.id, 'url', e.target.value)}
                                                                />
                                                                {btn.urlType === 'dynamic' && (
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => {
                                                                            const newVal = (btn.url || '') + '{{1}}';
                                                                            handleButtonChange(btn.id, 'url', newVal);
                                                                        }}
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 hover:bg-slate-300"
                                                                    >
                                                                        {`{1}`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                </FormSection>

                                {/* Horizontal Card Selector */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Layers size={20}/> Carousel Cards</h3>
                                            <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{carouselCards.length} / 10</span>
                                        </div>

                                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                                            {carouselCards.map((card, idx) => (
                                                <div 
                                                    key={card.id}
                                                    onClick={() => setSelectedCardIndex(idx)}
                                                    className={clsx(
                                                        "flex-shrink-0 relative w-28 h-32 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer snap-start group bg-white",
                                                        idx === selectedCardIndex 
                                                            ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md transform -translate-y-1" 
                                                            : "border-slate-200 hover:border-emerald-300 hover:shadow-sm"
                                                    )}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                                        {carouselHeaderFormat === 'IMAGE' ? <ImageIcon size={16}/> : <Video size={16}/>}
                                                    </div>
                                                    <span className={clsx("text-xs font-bold", idx === selectedCardIndex ? "text-emerald-700" : "text-slate-500")}>
                                                        Card {idx + 1}
                                                    </span>
                                                    {card.headerFile && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>}
                                                    
                                                    {carouselCards.length > 1 && (
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveCard(idx); }}
                                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-100 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            <button
                                                type="button"
                                                onClick={handleAddCard}
                                                disabled={carouselCards.length >= 10}
                                                className="flex-shrink-0 w-28 h-32 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed snap-start"
                                            >
                                                <Plus size={24} />
                                                <span className="text-xs font-medium mt-1">Add Card</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Active Card Editor */}
                                    {activeCard && (
                                        <div className="p-6">
                                            <div className="mb-6 flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Editing Card {selectedCardIndex + 1}</h4>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                {/* Card Media Upload */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Card Media ({carouselHeaderFormat})</label>
                                                    <div className="flex gap-4 items-start">
                                                        <label className="flex-grow flex flex-col items-center justify-center h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
                                                            {activeCard.headerFile ? (
                                                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100/90 text-emerald-600">
                                                                    <CheckCircle size={32} className="mb-2"/>
                                                                    <span className="text-sm font-medium">File Uploaded</span>
                                                                    <span className="text-xs text-slate-500 mt-1">Click to replace</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2">
                                                                        {carouselHeaderFormat === 'IMAGE' ? <ImageIcon className="w-6 h-6 text-slate-400"/> : <Video className="w-6 h-6 text-slate-400"/>}
                                                                    </div>
                                                                    <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> {carouselHeaderFormat.toLowerCase()}</p>
                                                                </div>
                                                            )}
                                                            <input type="file" className="hidden" onChange={(e) => handleCardFileChange(selectedCardIndex, e)} accept={getAcceptType(carouselHeaderFormat)} />
                                                        </label>

                                                        {/* STANDALONE IMAGE GEN BUTTON (CAROUSEL) */}
                                                        {carouselHeaderFormat === 'IMAGE' && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => openImageGen('CAROUSEL', selectedCardIndex)}
                                                                className="h-32 px-4 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors flex flex-col items-center justify-center gap-2 text-center"
                                                            >
                                                                <Sparkles size={20}/>
                                                                <span className="text-xs font-bold">Generate<br/>Image</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Card Body Text */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                                            Body Text <span className="text-red-500" title="Required">*</span>
                                                        </label>
                                                        <span className={clsx("text-xs font-mono px-1.5 py-0.5 rounded", 
                                                            activeCard.bodyText.length >= 160 ? "bg-red-100 text-red-600 font-bold" : 
                                                            activeCard.bodyText.length >= 140 ? "bg-amber-50 text-amber-600" : "text-slate-400")}>
                                                            {activeCard.bodyText.length}/160
                                                        </span>
                                                    </div>
                                                    
                                                    <RichTextEditor 
                                                        value={activeCard.bodyText}
                                                        onChange={(val) => handleCardBodyChange(selectedCardIndex, val)}
                                                        rows={4}
                                                        maxLength={160}
                                                        placeholder="Enter text for this card (Required)..."
                                                        required={true}
                                                        error={!activeCard.bodyText.trim()}
                                                    />

                                                    <div className="flex justify-between mt-1">
                                                        <p className="text-[11px] text-slate-500">
                                                            Required. Max 160 characters. Supports variables and formatting.
                                                        </p>
                                                        {!activeCard.bodyText.trim() && <span className="text-[11px] text-red-500 font-medium">Required</span>}
                                                    </div>
                                                </div>
                                                
                                                {/* Card Variables Input */}
                                                {((activeCard.bodyText.match(/{{\d+}}/g) || []).length > 0) && (
                                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Body Variables Sample Content</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {([...new Set(activeCard.bodyText.match(/{{\d+}}/g))]).map(v => {
                                                                const vn = v.match(/\d+/)?.[0] || '1';
                                                                return (
                                                                    <div key={vn}>
                                                                        <label className="text-xs text-slate-500 mb-1 block">{`{{${vn}}}`}</label>
                                                                        <input 
                                                                            placeholder={`Value for {{${vn}}}`} 
                                                                            value={activeCard.sampleContents?.[vn]||''} 
                                                                            onChange={e => handleCardSampleChange(selectedCardIndex, vn, e.target.value)} 
                                                                            className="w-full text-sm p-2 border border-slate-200 rounded focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Card Buttons Overrides */}
                                                {buttons.length > 0 && (
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <p className="text-sm font-semibold text-slate-700 mb-3">Button Configuration</p>
                                                        <div className="space-y-3">
                                                            {buttons.map(def => {
                                                                const val = activeCard.buttonValues[def.id] || {};
                                                                return (
                                                                    <div key={def.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <span className="font-bold text-xs uppercase text-slate-500 bg-white px-2 py-0.5 rounded border">{def.type.replace('_', ' ')}</span>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <div>
                                                                                <label className="text-xs text-slate-500 block mb-1">Button Label</label>
                                                                                <input 
                                                                                    placeholder={def.text} 
                                                                                    value={val.text !== undefined ? val.text : def.text} // Default to global text if not overridden
                                                                                    onChange={e => handleCardButtonValueChange(selectedCardIndex, def.id, 'text', e.target.value)}
                                                                                    className="w-full p-2 border border-slate-300 rounded focus:border-emerald-500 outline-none"
                                                                                />
                                                                            </div>
                                                                            {def.type === 'URL' && def.urlType === 'dynamic' && (
                                                                                <div>
                                                                                    <label className="text-xs text-slate-500 block mb-1">URL Variable Sample</label>
                                                                                    <div className="relative">
                                                                                        <span className="absolute left-3 top-2 text-slate-400 font-mono">.../</span>
                                                                                        <input 
                                                                                            placeholder="summer-sale"
                                                                                            value={val.urlExample || ''}
                                                                                            onChange={e => handleCardButtonValueChange(selectedCardIndex, def.id, 'urlExample', e.target.value)}
                                                                                            className="w-full p-2 pl-10 border border-slate-300 rounded bg-white focus:border-emerald-500 outline-none"
                                                                                        />
                                                                                    </div>
                                                                                    <p className="text-[10px] text-slate-400 mt-1">Value for {'{{1}}'} in the URL.</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* 2. Content Builder (Standard & Catalog & Call Permission) */}
                        {(templateType === 'Default' || templateType === 'Catalog' || templateType === 'Calling permissions request') && category !== 'AUTHENTICATION' && (
                            <FormSection title="Message Content" icon={MessageSquare}>
                                {/* Header Section - Hide for Call Permission */}
                                {templateType !== 'Calling permissions request' && (
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-semibold text-slate-700 flex items-center gap-2"><TypeIcon size={16}/> Header <span className="text-xs font-normal text-slate-500">(Optional)</span></h4>
                                            {templateType === 'Catalog' && catalogFormat === 'Multi-product message' ? (
                                                <div className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">Text Header Required</div>
                                            ) : (
                                                templateType === 'Catalog' ? (
                                                    <div className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">No Header</div>
                                                ) : (
                                                    <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="text-sm border-slate-300 rounded px-2 py-1">
                                                        <option value="NONE">None</option>
                                                        <option value="TEXT">Text</option>
                                                        <option value="IMAGE">Image</option>
                                                        <option value="VIDEO">Video</option>
                                                        <option value="DOCUMENT">Document</option>
                                                    </select>
                                                )
                                            )}
                                        </div>
                                        
                                        {(headerType === 'TEXT' || (templateType === 'Catalog' && catalogFormat === 'Multi-product message')) && (
                                            <div className="space-y-3">
                                                <InputField 
                                                    placeholder="Enter header text..." 
                                                    value={headerText} 
                                                    maxLength={60}
                                                    onChange={e => setHeaderText(e.target.value)}
                                                    rightElement={<span className="text-xs">{headerText.length}/60</span>}
                                                />
                                                <button type="button" onClick={() => setHeaderText((prev: string) => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">+ Add Variable</button>
                                                
                                                {variablesInHeader.length > 0 && (
                                                    <div className="mt-2 p-3 bg-white rounded border border-slate-200">
                                                        <p className="text-xs font-semibold text-slate-500 mb-2">Header Variables Sample Content</p>
                                                        <div className="grid gap-2">
                                                            {variablesInHeader.map(v => {
                                                                const num = v.match(/\d+/)?.[0] || '1';
                                                                return (
                                                                    <InputField 
                                                                        key={num}
                                                                        placeholder={`Sample for {{${num}}}`}
                                                                        value={headerSampleContents[num] || ''}
                                                                        onChange={e => setHeaderSampleContents({...headerSampleContents, [num]: e.target.value})}
                                                                    />
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType) && templateType !== 'Catalog' && (
                                            <div className="mt-2 flex gap-4 items-start">
                                                <label className="flex flex-col items-center justify-center flex-grow h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                                                        <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> {headerType.toLowerCase()}</p>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={handleFileChange} accept={getAcceptType()} />
                                                </label>
                                                
                                                {/* STANDALONE IMAGE GEN BUTTON (HEADER) */}
                                                {headerType === 'IMAGE' && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => openImageGen('HEADER')}
                                                        className="h-32 px-4 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors flex flex-col items-center justify-center gap-2 text-center"
                                                    >
                                                        <Sparkles size={20}/>
                                                        <span className="text-xs font-bold">Generate<br/>Image</span>
                                                    </button>
                                                )}
                                                
                                                {(headerFile || headerExistingMediaLink) && (
                                                    <div className="absolute right-0 top-0 hidden"><p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle size={12}/> File selected</p></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Body Section */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-700">Body Text *</label>
                                    
                                    <RichTextEditor 
                                        value={bodyText}
                                        onChange={setBodyText}
                                        rows={6}
                                        maxLength={1024}
                                        placeholder="Hello {{1}}, welcome to our service..."
                                        required={true}
                                    />
                                    
                                    {variablesInBody.length > 0 && (
                                        <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                                            <p className="text-sm font-semibold text-emerald-800 mb-3">Body Sample Content</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {variablesInBody.map(v => {
                                                    const num = v.match(/\d+/)?.[0] || '1';
                                                    return (
                                                        <div key={num}>
                                                            <label className="text-xs font-medium text-emerald-700 block mb-1">{`{{${num}}}`}</label>
                                                            <input 
                                                                className="w-full text-sm px-2 py-1.5 rounded border border-emerald-200 focus:border-emerald-500 outline-none"
                                                                placeholder={`Example content`}
                                                                value={sampleContents[num] || ''}
                                                                onChange={e => setSampleContents({...sampleContents, [num]: e.target.value})}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Section */}
                                <InputField 
                                    label="Footer (Optional)" 
                                    placeholder="Add a short footer..." 
                                    maxLength={60}
                                    value={footerText}
                                    onChange={e => setFooterText(e.target.value)}
                                    rightElement={<span className="text-xs">{footerText.length}/60</span>}
                                />
                            </FormSection>
                        )}

                        {/* 3. Buttons Configuration (Catalog Fixed Display) */}
                        {templateType === 'Catalog' && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border rounded shadow-sm text-slate-600"><ShoppingBag size={20}/></div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">{catalogFormat === 'Catalog message' ? 'View catalog' : 'View items'}</div>
                                        <div className="text-xs text-slate-500">Fixed button action</div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-slate-200 rounded text-slate-600">ReadOnly</span>
                            </div>
                        )}

                        {/* 3. Buttons Configuration (Call Permission Fixed Display) */}
                        {templateType === 'Calling permissions request' && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border rounded shadow-sm text-slate-600"><Phone size={20}/></div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">Call Permission Request</div>
                                        <div className="text-xs text-slate-500">Includes system 'Allow' and 'Decline' buttons.</div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-slate-200 rounded text-slate-600">Fixed</span>
                            </div>
                        )}

                        {/* 3. Buttons Configuration (Standard) */}
                        {templateType === 'Default' && category !== 'AUTHENTICATION' && (
                            <FormSection title="Interactive Buttons" icon={Smartphone}>
                                {!groupingValid && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm mb-4 flex gap-2 items-start">
                                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                        <span>Invalid grouping: Quick Reply buttons must be contiguous. Do not mix them indiscriminately with URL/Phone buttons.</span>
                                    </div>
                                )}
                                
                                <div className="space-y-3">
                                    {buttons.map((btn, idx) => (
                                        <div key={btn.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-3 relative group">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded border">{btn.type.replace('_', ' ')}</span>
                                                <button type="button" onClick={() => handleRemoveButton(btn.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                            
                                            {/* Standard Text for buttons except Copy Code (fixed/derived label logic in preview, but editable text for button itself usually) */}
                                            {btn.type !== 'COPY_CODE' && (
                                                <InputField 
                                                    placeholder="Button Text" 
                                                    value={btn.text} 
                                                    onChange={e => handleButtonChange(btn.id, 'text', e.target.value)} 
                                                    maxLength={25}
                                                />
                                            )}

                                            {btn.type === 'COPY_CODE' && (
                                                <div>
                                                    <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded mb-3 flex items-start gap-2">
                                                        <Copy size={16} className="shrink-0 mt-0.5"/>
                                                        <div>
                                                            <strong>Coupon/Limited-Time Offer:</strong> This button will copy the code below to the user's clipboard.
                                                        </div>
                                                    </div>
                                                    <InputField 
                                                        label="Coupon Code (Example)"
                                                        placeholder="e.g. SAVE20"
                                                        value={btn.codeExample || ''} 
                                                        onChange={e => handleButtonChange(btn.id, 'codeExample', e.target.value)} 
                                                        maxLength={15}
                                                    />
                                                </div>
                                            )}

                                            {btn.type === 'URL' && (
                                                <div className="grid grid-cols-3 gap-3">
                                                    <select 
                                                        value={btn.urlType} 
                                                        onChange={e => handleButtonChange(btn.id, 'urlType', e.target.value)} 
                                                        className="col-span-1 px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                                                    >
                                                        <option value="static">Static</option>
                                                        <option value="dynamic">Dynamic</option>
                                                    </select>
                                                    <div className="col-span-2 relative">
                                                        <InputField 
                                                            placeholder="https://www.example.com"
                                                            value={btn.url}
                                                            onChange={e => handleButtonChange(btn.id, 'url', e.target.value)}
                                                        />
                                                        {/* {{1}} HELPER BUTTON */}
                                                        {btn.urlType === 'dynamic' && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => {
                                                                    const newVal = (btn.url || '') + '{{1}}';
                                                                    handleButtonChange(btn.id, 'url', newVal);
                                                                }}
                                                                className="absolute right-2 top-9 text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 hover:bg-slate-300"
                                                                title="Insert {{1}}"
                                                            >
                                                                {`{1}`}
                                                            </button>
                                                        )}
                                                    </div>
                                                    {btn.urlType === 'dynamic' && (
                                                        <div className="col-span-3">
                                                            <InputField 
                                                                placeholder="Sample suffix (e.g. summer-sale) for {{1}}"
                                                                value={btn.urlExample}
                                                                onChange={e => handleButtonChange(btn.id, 'urlExample', e.target.value)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {btn.type === 'PHONE_NUMBER' && (
                                                <InputField 
                                                    placeholder="+1 (555) 123-4567"
                                                    value={btn.phone}
                                                    onChange={e => handleButtonChange(btn.id, 'phone', e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-2 flex-wrap">
                                    <button type="button" onClick={() => handleAddButton('QUICK_REPLY')} className="flex-1 py-2 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">+ Quick Reply</button>
                                    <button type="button" onClick={() => handleAddButton('URL')} className="flex-1 py-2 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">+ URL</button>
                                    <button type="button" onClick={() => handleAddButton('PHONE_NUMBER')} className="flex-1 py-2 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">+ Phone</button>
                                    <button type="button" onClick={() => handleAddButton('COPY_CODE')} className="flex-1 py-2 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">+ Copy Code</button>
                                </div>
                            </FormSection>
                        )}

                        {/* 4. Authentication Specifics */}
                        {category === 'AUTHENTICATION' && (
                            // ... (Existing Auth section)
                            <FormSection title="Authentication Configuration" icon={Lock}>
                                <div className="flex gap-4 mb-6">
                                    {['ONE_TAP', 'ZERO_TAP', 'COPY_CODE'].map(type => (
                                        <label key={type} className={`flex-1 cursor-pointer border rounded-lg p-4 transition-all ${authType === type ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-300'}`}>
                                            <input type="radio" name="authType" value={type} checked={authType === type} onChange={e => setAuthType(e.target.value)} className="sr-only" />
                                            <div className="font-semibold text-sm mb-1 text-slate-800">{type.replace('_', ' ').replace('ONE', 'One').replace('ZERO', 'Zero').replace('COPY', 'Copy')}</div>
                                            <div className="text-xs text-slate-500 leading-relaxed">
                                                {type === 'ONE_TAP' && 'Best for UX. Autofill enabled.'}
                                                {type === 'ZERO_TAP' && 'Automatic code verification.'}
                                                {type === 'COPY_CODE' && 'Standard manual entry.'}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {(authType === 'ONE_TAP' || authType === 'ZERO_TAP') && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-slate-700">Supported Apps</h4>
                                            <button type="button" onClick={handleAddApp} className="text-xs text-emerald-600 font-bold hover:underline">+ Add App</button>
                                        </div>
                                        {supportedApps.map((app, idx) => {
                                            const pkgValid = validatePackageName(app.package_name);
                                            const sigValid = validateSignatureHash(app.signature_hash);
                                            return (
                                                <div key={app.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                                                    {idx > 0 && <button onClick={() => handleRemoveApp(app.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField 
                                                            label="Package Name" 
                                                            placeholder="com.example.app" 
                                                            value={app.package_name} 
                                                            onChange={e => handleAppChange(app.id, 'package_name', e.target.value)} 
                                                            error={!pkgValid && app.package_name ? 'Invalid format' : undefined}
                                                        />
                                                        <InputField 
                                                            label="Signature Hash" 
                                                            placeholder="11 characters" 
                                                            value={app.signature_hash} 
                                                            onChange={e => handleAppChange(app.id, 'signature_hash', e.target.value)} 
                                                            maxLength={11}
                                                            error={!sigValid && app.signature_hash ? 'Must be 11 chars' : undefined}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {authType === 'ZERO_TAP' && (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex gap-3">
                                        <input type="checkbox" checked={zeroTapConsent} onChange={e => setZeroTapConsent(e.target.checked)} className="mt-1" />
                                        <span>I accept the WhatsApp Business Terms of Service regarding Zero-Tap authentication.</span>
                                    </div>
                                )}

                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={addSecurityRecommendation} onChange={e => setAddSecurityRecommendation(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500"/>
                                        Add security recommendation
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={addExpiry} onChange={e => setAddExpiry(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500"/>
                                        Add expiry time
                                    </label>
                                    {addExpiry && (
                                        <div className="pl-6 pt-1">
                                            <input type="number" value={expiryMinutes} onChange={e => setExpiryMinutes(parseInt(e.target.value))} className="w-20 px-2 py-1 border rounded text-sm" min={1} max={90} />
                                            <span className="text-sm text-slate-500 ml-2">minutes</span>
                                        </div>
                                    )}

                                    {/* TTL Section */}
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mb-2">
                                            <input 
                                                type="checkbox" 
                                                checked={addValidityPeriod} 
                                                onChange={e => setAddValidityPeriod(e.target.checked)} 
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span>Custom Time-To-Live (TTL)</span>
                                        </label>
                                        
                                        {addValidityPeriod && (
                                            <div className="pl-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="range" 
                                                        min="60" 
                                                        max="600" 
                                                        step="10" 
                                                        value={validityPeriodSeconds} 
                                                        onChange={e => setValidityPeriodSeconds(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                    />
                                                    <div className="min-w-[80px] px-3 py-1 bg-slate-100 rounded text-center text-sm font-mono text-slate-700 border border-slate-200">
                                                        {validityPeriodSeconds}s
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock size={12}/> If message not delivered within this time, it will be dropped.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        )}
                        
                        {/* Submit Buttons - Hide in view-only mode */}
                        {!isViewOnly && (
                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-12">
                                <button 
                                    type="button"
                                    onClick={handleSaveTemplate}
                                    disabled={isSubmitDisabled} 
                                    className={`px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 flex flex-col items-center gap-1 relative ${
                                        isSubmitDisabled 
                                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Save size={18} />
                                        {loading ? 'Saving...' : 'Save as Draft'}
                                    </div>
                                   
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSaveAndCreateMeta}
                                    disabled={isSubmitDisabled} 
                                    className={`px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 flex flex-col items-center gap-1 relative ${
                                        isSubmitDisabled 
                                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-blue-500/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Cloud size={18} />
                                        {loadingMeta ? 'Creating...' : (
                                            isSubmitDisabled ? (
                                                <span>
                                                    Submit to Meta
                                                </span>
                                            ) : 'Submit to Meta'
                                        )}
                                    </div>
                                    
                                </button>
                            </div>
                        )}

                        {/* Developer Debug Info */}
                        <div className="border-t pt-8">
                            <details className="group">
                                <summary className="list-none flex items-center gap-2 text-sm font-semibold text-slate-500 cursor-pointer select-none">
                                    <Code size={16}/> Developer Payloads
                                </summary>
                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-xs font-mono text-slate-400">Template JSON</span>
                                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto font-mono custom-scrollbar">{JSON.stringify(templateJson, null, 2)}</pre>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs font-mono text-slate-400">Message Payload</span>
                                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto font-mono custom-scrollbar">{JSON.stringify(sendMessageJson, null, 2)}</pre>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </form>
                )}
            </div>

            {/* Right Column: Preview */}
            <div className="lg:w-4/12 hidden lg:block">
                <div className="sticky top-20">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-widest mb-6">
                            <Smartphone size={16}/> Live Preview
                        </div>
                        {/* Live Preview renders standard form state OR AI variation depending on mode */}
                        <Preview 
                            components={activePreviewComponents} 
                            category={activePreviewCategory} 
                            addSecurityRecommendation={addSecurityRecommendation} 
                            authType={authType}
                            sampleContents={sampleContents}
                            headerFile={activePreviewHeaderFile}
                            headerSampleContents={headerSampleContents}
                            carouselCards={carouselCards}
                        />
                    </div>
                </div>
            </div>            {/* AI IMAGE GENERATOR MODAL */}
            {showImageGenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-violet-50 to-white">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Sparkles className="text-violet-500" size={20}/> AI Image Generator
                            </h3>
                            <button onClick={() => setShowImageGenModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20}/>
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Image Description</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm resize-none"
                                    rows={3}
                                    placeholder="Describe the image you want to generate..."
                                    value={imageGenPrompt}
                                    onChange={(e) => setImageGenPrompt(e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Reference Image (Optional)</label>
                                <div className="flex items-center gap-4">
                                    <label className="h-24 w-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center text-slate-400 relative overflow-hidden">
                                        {imageGenRefImage ? (
                                            <img src={`data:${imageGenRefImage.type};base64,${imageGenRefImage.data}`} alt="Ref" className="w-full h-full object-cover"/>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                <span className="text-[10px] mt-1">Upload</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" onChange={handleImageGenRefChange} accept="image/*" />
                                    </label>
                                    <div className="text-xs text-slate-500 flex-1">
                                        Upload an image to guide the AI style or content (Image-to-Image generation).
                                    </div>
                                </div>
                            </div>

                            {/* Generated Result Area */}
                            {generatedImagePreview ? (
                                <div className="mt-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Generated Result</p>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                        <img src={generatedImagePreview} alt="Generated" className="w-full h-auto aspect-square object-cover" />
                                    </div>
                                </div>
                            ) : isGeneratingImage && (
                                <div className="h-48 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-slate-100 animate-pulse">
                                    <Sparkles size={32} className="mb-2 text-violet-300 animate-spin"/>
                                    <span className="text-sm">Creating Magic (2K)...</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                             {!generatedImagePreview ? (
                                 <button 
                                     onClick={handleGenerateStandaloneImage}
                                     disabled={isGeneratingImage || !imageGenPrompt.trim()}
                                     className="px-6 py-2.5 rounded-lg font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                                 >
                                     <Wand2 size={18}/> Generate
                                 </button>
                             ) : (
                                 <>
                                     <button 
                                         onClick={() => setGeneratedImagePreview(null)}
                                         className="px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                                     >
                                         Try Again
                                     </button>
                                     <button 
                                         onClick={applyGeneratedImage}
                                         className="px-6 py-2.5 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                     >
                                         <CheckCircle size={18}/> Use This Image
                                     </button>
                                 </>
                             )}
                        </div>
                    </div>
                </div>
            )}
                </div>
            </main>
        </div>
    );
};

export default TemplateCreator;