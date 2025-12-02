export enum MessageStatus {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
    FAILED = 'FAILED'
}
  
export interface Campaign {
    id: string;
    phoneNumberId?: string; // Linked to a specific phone number
    name: string;
    date: string;
    stats: {
        sent: number;
        delivered: number;
        read: number;
        failed: number;
        responseRate: number; // percentage
    };
    status: 'Active' | 'Completed' | 'Draft';
}

export interface PhoneNumber {
    id: string;
    display_name: string;
    phone_number: string;
    quality_rating: 'High' | 'Medium' | 'Low';
    status: 'Connected' | 'Pending' | 'Offline';
}

export interface WABAStatus {
    healthStatus: 'Healthy' | 'Degraded' | 'Down';
    quotaLimit: string;
    currency: string;
    balance: number;
    qualityScore: number; // 0-100
    messagingLimitTier: string;
}