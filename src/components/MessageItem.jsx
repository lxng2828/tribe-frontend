import { useState } from 'react';
import { useMessage } from '../contexts/MessageContext';
import { DEFAULT_AVATAR } from '../utils/placeholderImages';
import './MessageItem.css';

const MessageItem = ({ message, isOwn, showAvatar, showTime }) => {
    const { editMessage, recallMessage } = useMessage();
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content || '');

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleEdit = async () => {
        if (editContent.trim() && editContent !== message.content) {
            try {
                await editMessage(message.id, editContent.trim());
                setIsEditing(false);
            } catch (error) {
                console.error('Error editing message:', error);
            }
        } else {
            setIsEditing(false);
            setEditContent(message.content || '');
        }
    };

    const handleRecall = async () => {
        try {
            await recallMessage(message.id);
        } catch (error) {
            console.error('Error recalling message:', error);
        }
    };

    const renderMessageContent = () => {
        if (message.isRecalled) {
            return (
                <div className="message-recalled">
                    <span className="recalled-text">This message was deleted</span>
                </div>
            );
        }

        if (isEditing) {
            return (
                <div className="message-edit">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleEdit();
                            } else if (e.key === 'Escape') {
                                setIsEditing(false);
                                setEditContent(message.content || '');
                            }
                        }}
                        className="edit-textarea"
                        autoFocus
                    />
                    <div className="edit-actions">
                        <button onClick={handleEdit} className="edit-save">Save</button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditContent(message.content || '');
                            }}
                            className="edit-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <>
                {/* Reply indicator */}
                {message.replyTo && (
                    <div className="reply-indicator">
                        <div className="reply-line"></div>
                        <div className="reply-content">
                            <span className="reply-author">{message.replyTo.senderName}</span>
                            <span className="reply-text">{message.replyTo.content}</span>
                        </div>
                    </div>
                )}

                {/* Message content */}
                {message.content && (
                    <div className="message-text">
                        {message.content}
                        {message.isEdited && <span className="edited-indicator">(edited)</span>}
                    </div>
                )}

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="message-attachments">
                        {message.attachments.map((attachment, index) => (
                            <div key={index} className="attachment-item">
                                {attachment.fileType.startsWith('image/') ? (
                                    <img
                                        src={attachment.fileUrl}
                                        alt={attachment.fileName}
                                        className="attachment-image"
                                    />
                                ) : attachment.fileType.startsWith('video/') ? (
                                    <video
                                        src={attachment.fileUrl}
                                        controls
                                        className="attachment-video"
                                    />
                                ) : attachment.fileType.startsWith('audio/') ? (
                                    <audio
                                        src={attachment.fileUrl}
                                        controls
                                        className="attachment-audio"
                                    />
                                ) : (
                                    <div className="attachment-file">
                                        <div className="file-icon">📎</div>
                                        <div className="file-info">
                                            <span className="file-name">{attachment.fileName}</span>
                                            <span className="file-size">
                                                {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                        <a
                                            href={attachment.fileUrl}
                                            download={attachment.fileName}
                                            className="file-download"
                                        >
                                            ⬇️
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
            {/* Avatar */}
            {showAvatar && !isOwn && (
                <img
                    src={message.senderAvatar || DEFAULT_AVATAR}
                    alt={message.senderName}
                    className="message-avatar"
                />
            )}

            {/* Message Content */}
            <div
                className="message-content"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {/* Sender name for group chats */}
                {!isOwn && showAvatar && (
                    <div className="sender-name">{message.senderName}</div>
                )}

                <div className="message-bubble">
                    {renderMessageContent()}
                </div>

                {/* Message Actions */}
                {showActions && !message.isRecalled && (
                    <div className={`message-actions ${isOwn ? 'own' : 'other'}`}>
                        <button
                            className="action-btn"
                            title="Reply"
                            onClick={() => {
                                // Trigger reply functionality
                                console.log('Reply to message:', message.id);
                            }}
                        >
                            ↩️
                        </button>
                        {isOwn && (
                            <>
                                <button
                                    className="action-btn"
                                    title="Edit"
                                    onClick={() => setIsEditing(true)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="action-btn"
                                    title="Delete"
                                    onClick={handleRecall}
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Timestamp */}
                {showTime && (
                    <div className="message-time">
                        {formatTime(message.createdAt)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageItem;
