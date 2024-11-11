import React, { useState } from 'react';

const ChatBot = () => {
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        document.querySelector(".info-container").classList.add("info-hidden")
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-input">
                <input
                    type="text"
                    placeholder="Input text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
            </div>
        </div>
    );
};

export default ChatBot;
