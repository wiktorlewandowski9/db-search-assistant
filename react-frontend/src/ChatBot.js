import React, { useState } from 'react';

const ChatBot = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (input.trim() === '') return; // Zapobiegaj wysyłaniu pustych zapytań

        setResponse('');

        document.querySelector(".info-container")?.classList.add("info-hidden");
        document.querySelector(".chatbot-output")?.classList.add("visible");

        try {
            // Przygotowanie URL z parametrem userQuery
            const query = encodeURIComponent(input.trim());
            const res = await fetch(`http://localhost:8080/query?userQuery=${query}`);

            if (res.ok) {
                const data = await res.json();
                setResponse(data.sql_query || 'No query received from server');
            } else {
                setResponse('Error: Unable to fetch response');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setResponse('Error: Unable to fetch response');
        }
    };

    const resizeInput = (el) => {
        el.style.width = el.value.length + "ch";
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-input">
                <input
                    type="text"
                    placeholder="Input text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        resizeInput(e.target);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    maxLength="120"
                />
            </div>
            <div className="chatbot-output">
                {!response ? (
                    <div className="loader"></div>
                ) : (
                    <div className="response">{response}</div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;
