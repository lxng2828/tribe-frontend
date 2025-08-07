import { useParams } from 'react-router-dom';
import { useMessage } from '../contexts/MessageContext';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import './MessagesPage.css';

const MessagesPage = () => {
    const { conversationId } = useParams();

    return (
        <div className="messages-page">
            <div className="messages-container">
                {/* Conversation List Panel */}
                <div className="conversation-panel">
                    <ConversationList selectedConversationId={conversationId} />
                </div>

                {/* Chat Window Panel */}
                <div className="chat-panel">
                    <ChatWindow conversationId={conversationId} />
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
