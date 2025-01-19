import React, { useState } from 'react';

const ChatBot = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState([]);

    // Function to handle sending the user's input to the API
    const handleSendMessage = async () => {
        if (input.trim() === '') return;
        setResponse([]);

        // Hide the info container and show the chatbot output
        document.querySelector(".info-container")?.classList.add("info-hidden");
        document.querySelector(".chatbot-output")?.classList.add("visible");

        try {
            const query = encodeURIComponent(input.trim());
            const apiUrl = process.env.REACT_APP_SPRING_URL;
            console.log(apiUrl);

            // Fetch the response from the API
            const res = await fetch(`${apiUrl}?userQuery=${query}`);
            const data = await res.json();
            const parsedData = JSON.parse(data.sql_query);
            setResponse(parsedData);
            
        } catch (error) {
            console.error('Fetch error:', error);
            setResponse([{ "Bad prompt!": 'Something went wrong... Try again!' }]);
        }
    };

    // Function to resize the input field based on the length of the user's input
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
