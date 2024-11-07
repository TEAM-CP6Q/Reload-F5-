import React, { useState, useEffect } from 'react';
import '../CSS/ChattingPage.css';
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";

const ChattingPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const chatId = 1; // 지정된 관리자와의 채팅을 위한 고유 chatId

    useEffect(() => {
        const handleGet = async () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            const response = await fetch(
                `http://3.37.122.192:8000/api/account/search-account/${email}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            const result = await response.json();

            if (response.status === 200) {
                setName(result.name);
            } else {
                alert("로그인 부탁: " + result.message);
            }
        };
        handleGet();
    }, []);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/chat'); 
        setSocket(ws);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.chatId === chatId) { // 지정된 관리자와의 채팅만 수신
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket 연결이 종료되었습니다.');
        };

        return () => {
            ws.close();
        };
    }, [chatId]);

    const handleSendMessage = () => {
        if (newMessage.trim() && socket) {
            const messageData = {
                chatId: chatId, // 지정된 관리자와의 채팅을 위한 ID
                sender: 'user',
                name: name,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            
            socket.send(JSON.stringify(messageData));
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newMessage.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleEndChat = () => {
        if (socket) {
            socket.close(); // WebSocket 연결 해제
            setSocket(null); // 소켓 상태 초기화
            alert('채팅이 종료되었습니다.');
            navigate('/');
        }
    };

    return (
        <div className="chatting-page">
            <Header />
            <div className="chat-content">
                {messages.map((msg, index) => (
                    <div key={index} className="message-sent-wrapper">
                        <div className="message-box message-sent">
                            <p className="message-content">{msg.content}</p>
                        </div>
                        <span className="message-timestamp">{msg.timestamp}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    className="input-field"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyUp={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                />
                <button className="send-button" onClick={handleSendMessage}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
                            fill="#388E3C"
                        />
                    </svg>
                </button>
                <button className="end-chat-button" onClick={handleEndChat}>
                    채팅 종료
                </button>
            </div>
        </div>
    );
};

export default ChattingPage;
