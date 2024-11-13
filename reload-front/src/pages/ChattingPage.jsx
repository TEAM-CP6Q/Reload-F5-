// ChattingPage.js

import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Header from '../components/Header';
import '../CSS/ChattingPage.css';

const ChattingPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [userName, setName] = useState(); 
  const messageContainerRef = useRef(null);

  const chatId = 1; // 서버와 일치하는 채팅방 ID 설정

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS('http://3.37.122.192:14000/ws/chat');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);

      // 서버의 채팅방 구독
      client.subscribe(`/topic/chat/${chatId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);

        if (!receivedMessage.time) {
          receivedMessage.time = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          });
        }

        // 수신된 메시지를 messages 상태에 추가
        setMessages((prevMessages) => {
          return [...prevMessages, receivedMessage];
        });
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

    // 회원정보 조회
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

  const sendMessage = () => {
    if (input.trim() && stompClient) {
      const message = {
        chatId,
        content: input,
        sender: userName, // 유저 이름으로 설정
      };

      stompClient.send('/app/chat', {}, JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container">
      <Header/>
      <div className="message-container" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === '새로고침' ? 'admin-message' : 'user-message'}>
            {msg.sender === '새로고침' ? (
              <>
                <div className="user-avatar-container">
                  <Avatar icon={<UserOutlined />} className="avatar-icon" />
                  <div className="sender-name">{msg.sender}</div>
                </div>
                <div className="admin-bubble">
                  <p className="message-content">{msg.content}</p>
                </div>
                <span className="timestamp">{msg.time}</span>
              </>
            ) : (
              msg.time && (
                <>
                  <div className="user-bubble">
                    <p className="message-content">{msg.content}</p>
                  </div>
                  <span className="timestamp">{msg.time}</span>
                </>
              )
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="메시지를 입력하세요"
        />
        <SendOutlined
          onClick={sendMessage}
          className="send-button"
        />
      </div>
    </div>
  );
};

export default ChattingPage;
