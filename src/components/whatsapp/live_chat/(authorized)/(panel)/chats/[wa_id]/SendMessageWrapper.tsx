'use client';

import { useCallback, useState, useEffect } from "react";
import SendMessageUI, { FileType } from "./SendMessageUI";
import { TemplateRequest } from "@/types/message-template-request";
import { useAuthStore } from "@/store/authStore";

export default function SendMessageWrapper({ waId, onMessageSent }: { waId: string; onMessageSent?: () => void }) {
    const [message, setMessage] = useState<string>('');
    const [fileType, setFileType] = useState<FileType | undefined>();
    const [file, setFile] = useState<File | undefined>();
    const [phoneNumberId, setPhoneNumberId] = useState<string>('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isLoadingConversation, setIsLoadingConversation] = useState<boolean>(true);

    // Fetch conversation to get phone_number_id
    useEffect(() => {
        async function fetchConversation() {
            setIsLoadingConversation(true);
            try {
                const { token } = useAuthStore.getState();
                
                if (!token) {
                    console.error('❌ No auth token found');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/live-chat/conversation/${waId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.conversation) {
                        setPhoneNumberId(result.conversation.phone_number_id || '');
                        setConversationId(result.conversation.id);
                        console.log('📞 Got phone_number_id:', result.conversation.phone_number_id);
                        console.log('💬 Got conversation_id:', result.conversation.id);
                    } else {
                        console.error('❌ Failed to get conversation:', result.error);
                    }
                } else {
                    console.error('❌ Failed to fetch conversation, status:', response.status);
                }
            } catch (error) {
                console.error('❌ Error fetching conversation:', error);
            } finally {
                setIsLoadingConversation(false);
            }
        }

        fetchConversation();
    }, [waId]);
    
    const onMessageSend = useCallback(async () => {
        try {
            const { token, user } = useAuthStore.getState();
            
            if (!token || !user?.id) {
                console.error('❌ No auth token found');
                return;
            }

            if (!phoneNumberId) {
                console.error('❌ No phone_number_id available - conversation may not be loaded yet');
                alert('Phone number ID not loaded. Please wait a moment and try again.');
                return;
            }

            const trimmedMessage = message.trim();
            
            // Validate that we have a message or a file
            if (!trimmedMessage && !file) {
                console.error('❌ Message or file is required');
                alert('Please enter a message or attach a file.');
                return;
            }

            let mediaUrl: string | undefined;

            // Upload file to Supabase if present
            if (file) {
                try {
                    // Check file size limits based on type (WhatsApp limits)
                    const fileSizeMB = file.size / 1024 / 1024;
                    let maxSizeMB = 5; // Default for images
                    
                    if (fileType === 'video') {
                        maxSizeMB = 16;
                    } else if (fileType === 'file') {
                        maxSizeMB = 100;
                    }
                    
                    if (fileSizeMB > maxSizeMB) {
                        console.error(`❌ File too large: ${fileSizeMB.toFixed(2)} MB exceeds ${maxSizeMB} MB limit`);
                        alert(`File too large! ${file.name} is ${fileSizeMB.toFixed(1)} MB.\n\nWhatsApp limits:\n• Images: 5 MB\n• Videos: 16 MB\n• Documents: 100 MB\n\nPlease use a smaller file or compress it.`);
                        return;
                    }
                    
                    console.log('📤 Uploading file to Supabase:', file.name, file.type, `(${fileSizeMB.toFixed(2)} MB)`);
                    
                    // Generate unique filename
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `whatsapp-media/${fileName}`;

                    // TODO: Implement file upload to backend API
                    // For now, we'll skip media messages
                    console.warn('⚠️ Media upload not yet implemented for JWT auth');
                    alert('Media messages are not yet supported. Please send text messages only.');
                    return;
                } catch (error) {
                    console.error('❌ Exception uploading file:', error);
                    alert('Failed to upload file. Please try again.');
                    return;
                }
            }

            const requestBody: {
                to: string;
                message: string;
                message_type: string;
                phone_number_id: string;
                conversation_id: number | null;
                media_url?: string;
            } = {
                to: waId,
                message: trimmedMessage || (file ? file.name : '[File]'),
                message_type: fileType || 'text',
                phone_number_id: phoneNumberId,
                conversation_id: conversationId,
            };

            // Add media URL if we have one
            if (mediaUrl) {
                requestBody.media_url = mediaUrl;
            }

            console.log('📤 Sending request body:', requestBody);
            console.log('📞 Phone Number ID:', phoneNumberId);
            console.log('📱 To:', waId);
            console.log('💬 Message:', trimmedMessage || file?.name);
            console.log('🖼️ Media URL:', mediaUrl);

            const response = await fetch(`http://localhost:8080/api/live-chat/send-message?user_id=${user.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log('✅ Message sent successfully');
                setMessage('');
                setFileType(undefined);
                setFile(undefined);
                
                // Notify parent to refresh messages
                if (onMessageSent) {
                    onMessageSent();
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to send message:', errorText);
                console.error('❌ Status:', response.status);
                console.error('❌ Request was:', requestBody);
                throw new Error(`Request failed with status code ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('❌ Error sending message:', error);
            throw error; // Re-throw to let UI handle it
        }
    }, [waId, fileType, message, file, phoneNumberId, conversationId, onMessageSent]);

    const onTemplateMessageSend = useCallback(async (req: TemplateRequest) => {
        try {
            const { token, user } = useAuthStore.getState();
            
            if (!token || !user?.id) {
                console.error('❌ No auth token found');
                return;
            }

            if (!phoneNumberId) {
                console.error('❌ No phone_number_id available');
                return;
            }

            const requestBody = {
                to: waId,
                template: req,
                message_type: 'template',
                phone_number_id: phoneNumberId,
                conversation_id: conversationId,
            };

            const response = await fetch(`http://localhost:8080/api/live-chat/send-message?user_id=${user.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log('✅ Template message sent successfully');
            } else {
                const error = await response.text();
                console.error('❌ Failed to send template:', error);
                throw new Error(`Request failed with status code ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error sending template:', error);
        }
    }, [waId, phoneNumberId, conversationId]);

    return (
        <SendMessageUI 
            message={message} 
            file={file} 
            fileType={fileType} 
            setMessage={setMessage} 
            setFileType={setFileType} 
            setFile={setFile} 
            onMessageSend={onMessageSend} 
            onTemplateMessageSend={onTemplateMessageSend}
            disabled={isLoadingConversation || !phoneNumberId}
        />
    )
}