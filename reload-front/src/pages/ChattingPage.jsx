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
  const [userName, setUserName] = useState('Anonymous');
  const messageContainerRef = useRef(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/chat');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);

        if (!receivedMessage.time) {
          receivedMessage.time = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          });
        }

        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg.time === receivedMessage.time && msg.content === receivedMessage.content
          );
          return isDuplicate ? prevMessages : [...prevMessages, receivedMessage];
        });
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  // 초기 메시지를 추가하는 useEffect
  useEffect(() => {
    const initialMessage = {
      sender: '새로고침',
      content: '안녕하세요. 새로고침입니다. 어떤 것을 도와드릴까요?',
      role: 'admin',
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prevMessages) => [initialMessage, ...prevMessages]);
  }, []);

  // 서버에서 유저 이름 가져오기
  useEffect(() => {
    const handleGetUserName = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      try {
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

        if (response.ok) {
          const result = await response.json();
          setUserName(result.name);
        } else {
          const result = await response.json();
          alert("로그인 부탁: " + result.message);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };
    
    handleGetUserName();
  }, []);

  const sendMessage = () => {
    if (input.trim() && stompClient) {
      const currentTime = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const message = {
        sender: userName,
        content: input,
        role: 'user',
        time: currentTime,
      };

      if (message.time) {
        stompClient.send('/app/sendMessage', {}, JSON.stringify(message));
        setMessages((prevMessages) => [...prevMessages, message]);
      }

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
          <div key={index} className={msg.role === 'admin' ? 'admin-message' : 'user-message'}>
            {msg.role === 'admin' ? (
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
