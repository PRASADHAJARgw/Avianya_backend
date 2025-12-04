export interface TemplateButton {
    id: number;
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'COPY_CODE';
    text: string;
    url?: string;
    phone?: string;
    urlType?: 'static' | 'dynamic';
    urlExample?: string;
    codeExample?: string; // For COPY_CODE
}

export interface CarouselCard {
    id: number;
    headerFile?: HeaderFile | null;
    bodyText: string;
    // We store button values specific to this card (text, url param) keyed by the button Definition ID
    buttonValues: { [key: number]: { text?: string; url?: string; urlExample?: string } }; 
    sampleContents?: SampleContent;
}

export interface SupportedApp {
    id: number;
    package_name: string;
    signature_hash: string;
}

export interface SampleContent {
    [key: string]: string;
}

export interface HeaderFile {
    url: string;
    type: string;
}

export interface User {
    id: string;
    email: string;
    user_metadata?: {
        role?: string;
    };
}

export interface ComponentJson {
    type: string;
    format?: string;
    text?: string;
    example?: any;
    buttons?: any[];
    cards?: ComponentJson[]; // For Carousel
    components?: ComponentJson[]; // For Carousel Cards
    [key: string]: any;
}

export interface TemplateJson {
    name: string;
    language: string;
    category: string;
    components: ComponentJson[];
    message_send_ttl_seconds?: number;
}
