import { TextMessage } from "@/types/Message";

export default function ReceivedTextMessageUI(props: { textMessage: TextMessage }) {
    const { textMessage } = props;
    // Safely access body, fallback to empty string if missing
    const body = textMessage?.text?.body ?? textMessage?.body ?? '';
    return (
        <div className="px-2 py-1 text-sm leading-relaxed break-words">
            {body ? body : <span className="text-gray-400 italic">Message not available</span>}
        </div>
    );
}