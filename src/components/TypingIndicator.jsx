import './TypingIndicator.css';

const TypingIndicator = ({ users }) => {
    if (!users || users.length === 0) return null;

    const getTypingText = () => {
        if (users.length === 1) {
            return `${users[0].userName} is typing`;
        } else if (users.length === 2) {
            return `${users[0].userName} and ${users[1].userName} are typing`;
        } else {
            return `${users[0].userName} and ${users.length - 1} others are typing`;
        }
    };

    return (
        <div className="typing-indicator">
            <div className="typing-text">{getTypingText()}</div>
            <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
            </div>
        </div>
    );
};

export default TypingIndicator;
