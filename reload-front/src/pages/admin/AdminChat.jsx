import React, { useState, useEffect } from 'react';
import { Badge, List, Layout, Input, Button, Typography } from 'antd';
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../../CSS/admin/AdminChat.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

const AdminChat = () => {
  const [chatList, setChatList] = useState([]); // 유저 채팅 목록
  const [selectedChat, setSelectedChat] = useState(null); // 선택된 유저 채팅
  const [messages, setMessages] = useState([]); // 현재 채팅의 메시지
  const [newMessage, setNewMessage] = useState(''); // 새로운 메시지
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트
  const navigate = useNavigate();

  useEffect(() => {
    // SockJS와 STOMP 클라이언트를 통한 WebSocket 연결 설정
    const socket = new SockJS('http://localhost/ws/chat');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log("WebSocket 연결 성공");

      // 유저 채팅 목록 구독 설정
      client.subscribe('/topic/chatList', (message) => {
        const chatData = JSON.parse(message.body);
        setChatList(chatData); // 초기 유저 채팅 목록 수신
      });

      // 선택된 채팅의 메시지 구독 설정
      if (selectedChat) {
        client.subscribe(`/topic/chat/${selectedChat.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP 오류: ' + frame.headers['message']);
      console.error('상세 오류: ' + frame.body);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    };
  }, [selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]); // 새로운 채팅 선택 시 메시지 초기화

    // 선택된 유저 채팅 구독
    if (stompClient) {
      stompClient.subscribe(`/topic/chat/${chat.id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      // 메시지 가져오기 요청
      stompClient.publish({
        destination: '/app/chat.fetchMessages',
        body: JSON.stringify({ chatId: chat.id }),
      });
    }

    // 읽은 메시지로 처리
    setChatList((prevChatList) =>
      prevChatList.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClient && selectedChat) {
      const messageData = {
        chatId: selectedChat.id,
        sender: 'admin', // 관리자가 보낸 메시지
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // 메시지 전송
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(messageData),
      });

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    }
  };

  return (
    <Layout className="admin-chat">
      <Sider width={250} className="chat-sider">
        <List
          header={<div>채팅 목록</div>}
          dataSource={chatList}
          renderItem={(chat) => (
            <List.Item onClick={() => handleSelectChat(chat)} className="chat-item">
              <Badge count={chat.unreadCount} offset={[10, 0]} style={{ backgroundColor: '#f5222d' }}>
                <div>{chat.name}</div>
              </Badge>
            </List.Item>
          )}
          locale={{
            emptyText: <Text style={{ color: '#ffffff' }}>문의내역이 없습니다</Text>
          }}
        />
      </Sider>

      <Content className="chat-content">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h3>{selectedChat.name}와의 채팅</h3>
              <Button onClick={() => navigate('/')}>채팅 종료</Button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === 'admin' ? 'message-sent' : 'message-received'}>
                  <div className="message-box">
                    <p>{msg.content}</p>
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <Input
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={handleSendMessage}
              />
              <Button type="primary" onClick={handleSendMessage}>전송</Button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">채팅을 선택하세요</div>
        )}
      </Content>
    </Layout>
  );
};

export default AdminChat;
