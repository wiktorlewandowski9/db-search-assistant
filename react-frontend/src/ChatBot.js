import React, { useState } from 'react';

const ChatBot = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState([]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        setResponse([]);

        document.querySelector(".info-container")?.classList.add("info-hidden");
        document.querySelector(".chatbot-output")?.classList.add("visible");

        try {
            const query = encodeURIComponent(input.trim());
            const res = await fetch(`http://localhost:8080/query?userQuery=${query}`);

            const data = await res.json();
            const parsedData = JSON.parse(data.sql_query);
            setResponse(parsedData);
            
        } catch (error) {
            console.error('Fetch error:', error);
            setResponse([{ "Bad prompt!": 'Something went wrong... Try again!' }]);
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
                {!response.length ? (
                    <div className="loader"></div>
                ) : (
                    <div className="response">
                        <table className="response-table">
                            <thead>
                                <tr>
                                    {Object.keys(response[0] || {}).map((key) => (
                                        <th key={key}>{key.replace("_", ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {response.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.keys(row).map((key) => (
                                            <td key={key}>
                                                {key === 'hire_date'
                                                    ? new Date(row[key]).toLocaleDateString()
                                                    : row[key]?.toString()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;
