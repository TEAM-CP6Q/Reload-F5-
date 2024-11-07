// 관리자 채팅 코드 (AdminChat.js)

import React, { useState, useEffect } from 'react';
import { Badge, List, Layout, Input, Button, Typography } from 'antd';
import { useNavigate } from "react-router-dom";
import '../../CSS/admin/AdminChat.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

const AdminChat = () => {
  const [chatList, setChatList] = useState([]); // 유저 채팅 목록
  const [selectedChat, setSelectedChat] = useState(null); // 선택된 유저 채팅
  const [messages, setMessages] = useState([]); // 현재 채팅의 메시지
  const [newMessage, setNewMessage] = useState(''); // 새로운 메시지
  const [socket, setSocket] = useState(null); // WebSocket 연결
  const navigate = useNavigate();

  useEffect(() => {
    // WebSocket 연결 설정 및 메시지 수신 처리
    const ws = new WebSocket('ws://localhost:8080/chat');
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (selectedChat && message.chatId === selectedChat.id) { // 선택된 유저와의 채팅만 수신
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        setChatList((prevChatList) => {
          const updatedChatList = [...prevChatList];
          const chatIndex = updatedChatList.findIndex((chat) => chat.id === message.chatId);
          if (chatIndex !== -1) {
            updatedChatList[chatIndex].unreadCount += 1;
          } else {
            updatedChatList.push({ id: message.chatId, name: message.senderName, unreadCount: 1 });
          }
          return updatedChatList;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]); // 새로운 채팅 선택 시 메시지 초기화
    if (socket) {
      // 유저의 채팅 메시지 불러오기
      socket.send(JSON.stringify({ type: 'fetchMessages', chatId: chat.id }));
    }
    setChatList((prevChatList) =>
      prevChatList.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socket && selectedChat) {
      const messageData = {
        chatId: selectedChat.id,
        sender: 'admin', // 관리자가 보낸 메시지
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      socket.send(JSON.stringify(messageData));
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
