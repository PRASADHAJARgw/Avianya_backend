import { ContactFE } from "@/types/contact";
import BlankUser from "./BlankUser";
import { UPDATE_CURRENT_CONTACT, useCurrentContact, useCurrentContactDispatch } from "./CurrentContactContext";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

export default function ContactUI(props: { contact: ContactFE }) {
    const { contact } = props;
    const currentContact = useCurrentContact()
    const setCurrentContact = useCurrentContactDispatch()
    const navigate = useNavigate();
    const { waId: rawWaId } = useParams<{ waId?: string }>();
    const routedWaId = rawWaId ? (rawWaId.startsWith('+') ? rawWaId.slice(1) : rawWaId) : undefined;
    const activeWaId = currentContact?.current?.wa_id || routedWaId;
    const isActive = activeWaId === contact.wa_id;
    const handleContactClick = () => {
        if (setCurrentContact) {
            setCurrentContact({ type: UPDATE_CURRENT_CONTACT, contact: contact });
        }
        navigate(`/wa/live-chat/chats/${contact.wa_id}`);
    };

    return (
        <div 
            onClick={handleContactClick}
            className="cursor-pointer"
        >
            <div className={cn("flex flex-row p-2 hover:bg-background-default-hover gap-2 cursor-pointer ", isActive ? "bg-background-default-hover" : "") }>
                <div>
                    <BlankUser className="w-12 h-12" />
                </div>
                <div className="flex flex-row justify-between items-center w-full px-2">
                    <div className="flex items-center gap-">
                        <div className="flex flex-col">
                            <div className="font-semibold text-base">{contact.name || contact.profile_name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">+{contact.wa_id}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        {(() => {
                            if (contact.unread_count && contact.unread_count > 0) {
                                return (
                                    <div className="bg-green-500 flex-grow-0 flex-shrink-0 p-2 h-6 w-6 text-white rounded-full text-xs font-bold flex items-center justify-center">{contact.unread_count}</div>
                                )
                            }
                        })()}
                        <div>
                            <span className="text-xs text-gray-500">{contact.timeSince}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}