import React, { useState, useEffect, useRef } from 'react';
import '../CSS/ChattingPage.css';
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChattingPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [name, setName] = useState('');
    const stompClientRef = useRef(null);
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
        if (!stompClientRef.current) {
            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws/chat'),
           
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                    console.log(str);
                },
            });

            client.onConnect = () => {
                console.log('Connected to WebSocket server');
                client.subscribe(`/topic/chat/${chatId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            };

            client.onStompError = (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            };

            client.activate();
            stompClientRef.current = client;
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [chatId]);

    const handleSendMessage = () => {
        if (newMessage.trim() && stompClientRef.current) {
            const messageData = {
                chatId: chatId,
                sender: 'user',
                name: name,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // 서버로 메시지 전송만 하고 상태 업데이트는 하지 않음
            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(messageData),
            });

            // 메시지 전송 후 입력 필드 비움
            setNewMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEndChat = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
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
