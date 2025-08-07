import { useState, useRef, useEffect } from 'react';
import { useMessage } from '../contexts/MessageContext';
import './MessageInput.css';

const MessageInput = ({ onSendMessage }) => {
    const { sendTypingIndicator } = useMessage();
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [message]);

    // Handle typing indicator
    const handleTyping = () => {
        if (!isTypingRef.current) {
            sendTypingIndicator(true);
            isTypingRef.current = true;
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingIndicator(false);
            isTypingRef.current = false;
        }, 1000);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        handleTyping();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (!message.trim() && files.length === 0) return;

        const messageType = files.length > 0 ?
            (files[0].type.startsWith('image/') ? 'IMAGE' :
                files[0].type.startsWith('video/') ? 'VIDEO' :
                    files[0].type.startsWith('audio/') ? 'AUDIO' : 'FILE')
            : 'TEXT';

        try {
            await onSendMessage({
                content: message.trim(),
                messageType
            }, files.length > 0 ? files : null);

            // Clear input
            setMessage('');
            setFiles([]);

            // Stop typing indicator
            if (isTypingRef.current) {
                sendTypingIndicator(false);
                isTypingRef.current = false;
            }

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
        e.target.value = ''; // Reset input
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return '🖼️';
        if (file.type.startsWith('video/')) return '🎥';
        if (file.type.startsWith('audio/')) return '🎵';
        return '📎';
    };

    return (
        <div className="message-input-container">
            {/* File Preview */}
            {files.length > 0 && (
                <div className="file-preview-container">
                    <div className="file-preview-list">
                        {files.map((file, index) => (
                            <div key={index} className="file-preview-item">
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="preview-image"
                                    />
                                ) : (
                                    <div className="preview-file">
                                        <span className="file-icon">{getFileIcon(file)}</span>
                                        <div className="file-details">
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">{formatFileSize(file.size)}</span>
                                        </div>
                                    </div>
                                )}
                                <button
                                    className="remove-file-btn"
                                    onClick={() => removeFile(index)}
                                    title="Remove file"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="message-input-wrapper">
                {/* File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    className="file-input-hidden"
                />

                {/* Input Actions */}
                <div className="input-actions">
                    <button
                        className="input-action-btn"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach file"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                        </svg>
                    </button>

                    <button
                        className="input-action-btn"
                        onClick={() => {
                            // Handle image capture
                            fileInputRef.current?.click();
                        }}
                        title="Take photo"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 15.2l3.536-3.536 1.414 1.414L12 18.028l-4.95-4.95 1.414-1.414L12 15.2z" />
                            <path d="M17 8l-1.5-1.5h-7L7 8H4v10h16V8h-3zM12 16c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                        </svg>
                    </button>

                    <button
                        className="input-action-btn"
                        title="Emoji"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-1.5-1.5L10 14l1.5 1.5L16 12l1.5 1.5L12 17z" />
                        </svg>
                    </button>
                </div>

                {/* Text Input */}
                <div className="text-input-container">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="message-textarea"
                        rows={1}
                        maxLength={4000}
                    />
                </div>

                {/* Send Button / Voice Button */}
                {message.trim() || files.length > 0 ? (
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        title="Send message"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                ) : (
                    <button
                        className={`voice-btn ${isRecording ? 'recording' : ''}`}
                        onClick={() => setIsRecording(!isRecording)}
                        title={isRecording ? "Stop recording" : "Record voice message"}
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MessageInput;
