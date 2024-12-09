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
  const [userName, setUserName] = useState(''); // 유저 이름 상태
  const [chatId, setChatId] = useState(null); // 동적으로 설정된 채팅방 ID
  const messageContainerRef = useRef(null);

  // 회원정보 조회 및 채팅방 초기화
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        console.log('Initializing chat...'); // 디버깅
        console.log('Token:', token); // 토큰 확인
        console.log('Email:', email); // 이메일 확인

        // 회원정보 조회
        const userResponse = await fetch(
          `https://refresh-f5-server.o-r.kr/api/account/search-account/${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('User info response status:', userResponse.status); // 응답 상태 확인
        const userResult = await userResponse.json();
        console.log('User info response data:', userResult); // 응답 데이터 확인

        if (userResponse.status === 200) {
          const sender = userResult.name;
          setUserName(sender); // 유저 이름 설정
          console.log('User name set to:', sender); // 유저 이름 설정 확인

          // 채팅방 초기화 (chatId 가져오기)
          const chatResponse = await fetch(
            `https://refresh-f5-server.o-r.kr/api/chat/create-chat?email=${email}&sender=${sender}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log('Chat creation response status:', chatResponse.status); // 응답 상태 확인
          const chatResult = await chatResponse.json();
          console.log('Chat creation response data:', chatResult); // 응답 데이터 확인

          if (chatResponse.status === 200) {
            setChatId(chatResult.chatId); // chatId 설정
            console.log('Chat ID set to:', chatResult.chatId); // chatId 설정 확인
          } else {
            alert('채팅방 초기화 실패: ' + chatResult.message);
          }
        } else {
          alert('회원정보 조회 실패: ' + userResult.message);
        }
      } catch (error) {
        console.error('에러 발생:', error);
        alert('서버와의 통신 중 문제가 발생했습니다.');
      }
    };

    initializeChat();
  }, []);

  // WebSocket 연결 설정
  useEffect(() => {
    if (chatId) {
      console.log('Establishing WebSocket connection for chatId:', chatId); // WebSocket 연결 로그

      const socket = new SockJS('https://refresh-f5-server.o-r.kr/ws/chat');
      const client = Stomp.over(socket);

      client.connect(
        {},
        () => {
          setStompClient(client);
          console.log('WebSocket connected.'); // WebSocket 연결 성공

          // 서버의 채팅방 구독
          client.subscribe(`/topic/chat/${chatId}`, (message) => {
            console.log('Message received:', message); // 수신 메시지 디버깅
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
        },
        (error) => {
          console.error('WebSocket connection error:', error); // WebSocket 연결 실패
        }
      );

      return () => {
        if (stompClient) {
          stompClient.disconnect();
          console.log('WebSocket disconnected.'); // WebSocket 연결 해제
        }
      };
    }
  }, [chatId]);

  // 메시지 전송
  const sendMessage = () => {
    if (input.trim() && stompClient) {
      const message = {
        chatId,
        content: input,
        sender: userName, // 유저 이름 설정
      };

      console.log('Sending message:', message); // 메시지 전송 디버깅

      stompClient.send('/app/chat', {}, JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  // 메시지 자동 스크롤
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatting-container">
      <Header />
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
      <div className="chatting-input-container">
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
        <SendOutlined onClick={sendMessage} className="send-button" />
      </div>
    </div>
  );
};

export default ChattingPage;
