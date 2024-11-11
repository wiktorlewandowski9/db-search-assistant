import React, { useState } from 'react';

const ChatBot = () => {
    const [input, setInput] = useState('');
    const handleSendMessage = () => {
        document.querySelector(".info-container").classList.add("info-hidden")
        document.querySelector(".chatbot-output").classList.add("visible")
    };

    function resizeInput(el) {
        el.style.width = el.value.length + "ch";
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-input">
                <input
                    type="text"
                    placeholder="Input text"
                    value={input}
                    onChange={(e) => {setInput(e.target.value); resizeInput(e.target);}}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    maxLength="120"
                />
            </div>
            <div className="chatbot-output">
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default ChatBot;
