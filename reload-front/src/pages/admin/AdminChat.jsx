import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const inputValueRef = useRef('');
  const adminName = "새로고침";

  useEffect(() => {
    if (stompClient) return;
  
    const socket = new SockJS('http://localhost:8080/chat');
    const client = Stomp.over(socket);
  
    client.connect({}, () => {
      setStompClient(client);
      setIsConnected(true);
  
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);
  
        // 시간이 없는 수신 메시지에 현재 시간 추가
        if (!receivedMessage.time) {
          receivedMessage.time = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          });
        }
  
        if (receivedMessage.time || receivedMessage.sender !== adminName) {
          setMessages((prevMessages) => {
            if (!prevMessages.some(msg => msg.time === receivedMessage.time && msg.content === receivedMessage.content)) {
              return [...prevMessages, receivedMessage];
            }
            return prevMessages;
          });
        }
  
        if (receivedMessage.sender !== adminName) {
          setChatList((prevList) => {
            if (!prevList.some(chat => chat.sender === receivedMessage.sender)) {
              return [...prevList, { sender: receivedMessage.sender, content: receivedMessage.content, unread: 1 }];
            }
            return prevList.map((chat) =>
              chat.sender === receivedMessage.sender
                ? { ...chat, content: receivedMessage.content, unread: chat.unread + 1 }
                : chat
            );
          });
        }
      });
    });
  
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [stompClient]);
  

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputValueRef.current.trim() && isConnected && stompClient && selectedUser) {
      const currentTime = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const message = {
        sender: adminName,
        content: inputValueRef.current,
        role: 'admin',
        recipient: selectedUser.sender,
        time: currentTime,
      };

      stompClient.send('/app/sendMessage', {}, JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      inputValueRef.current = ''; // 전송 후 입력값 초기화
      inputRef.current.value = ''; // input 필드 초기화
      inputRef.current.focus(); // 포커스를 유지
    }
  };

  const handleChange = (e) => {
    inputValueRef.current = e.target.value;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setChatList((prevList) =>
      prevList.map((chat) => (chat.sender === user.sender ? { ...chat, unread: 0 } : chat))
    );
  };

  const ChatList = () => (
    <Card title="채팅 목록" style={styles.chatList} bordered>
      <List
        itemLayout="horizontal"
        dataSource={chatList}
        renderItem={(chat) => (
          <List.Item
            style={{
              backgroundColor: selectedUser?.sender === chat.sender ? '#e0f7fa' : 'white',
              cursor: 'pointer',
              borderRadius: '5px',
              margin: '5px 0',
              padding: '10px',
            }}
            onClick={() => selectUser(chat)}
          >
            <List.Item.Meta
              avatar={<Avatar icon="user" />}
              title={<span><strong>{chat.sender}</strong></span>}
              description={chat.content}
            />
            {chat.unread > 0 && selectedUser?.sender !== chat.sender && (
              <span style={styles.unreadBadge}>안 읽음: {chat.unread}</span>
            )}
          </List.Item>
        )}
      />
    </Card>
  );

  const ChatWindow = () => (
    <Card title={selectedUser ? `${selectedUser.sender}와의 대화` : '유저를 선택하세요'} style={styles.chatWindow} bordered>
      <div style={styles.messageContainer} ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === 'admin' ? styles.adminMessage : styles.userMessage}>
            {msg.role !== 'admin' && (
              <div style={styles.userAvatarContainer}>
                <Avatar style={styles.outlineAvatar} />
                <div style={styles.senderName}>{msg.sender}</div>
              </div>
            )}
            <div style={msg.role === 'admin' ? styles.adminBubble : styles.userBubble}>
              <div style={styles.messageContent}>{msg.content}</div>
            </div>
            <span style={styles.timestamp}>{msg.time}</span> {/* 메시지 박스 아래에 시간 표시 */}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          className='admin-chat-input'
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          style={styles.input}
          ref={inputRef}
          disabled={!selectedUser}
          autoComplete="off"
          autoFocus
        />
        <SendOutlined
          onClick={sendMessage}
          style={{ color: '#4CAF50', fontSize: '24px', cursor: 'pointer', marginLeft: '10px' }}
        />
      </div>
    </Card>
  );

  return (
    <div style={styles.container}>
      <ChatList />
      <ChatWindow />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    maxWidth: '1000px',
    margin: '0 auto',
    gap: '20px',
  },
  chatList: {
    width: '30%',
    overflowY: 'auto',
  },
  chatWindow: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  unreadBadge: {
    fontSize: '12px',
    color: 'red',
  },
  messageContainer: {
    flex: 1,
    height: '80vh',
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  userAvatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '8px',
  },
  outlineAvatar: {
    border: '2px solid #ddd',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
  },
  adminMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
    alignItems: 'center',
  },
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '10px',
    alignItems: 'center',
  },
  adminBubble: {
    maxWidth: '60%',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: 'rgba(56, 142, 60, 0.2)',
    color: '#333',
    textAlign: 'left',
  },
  userBubble: {
    maxWidth: '60%',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: '#F5F5DC',
    color: '#333',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: '4px',
    textAlign: 'center',
  },
  messageContent: {
    fontSize: '16px',
    lineHeight: '1.4',
  },
  
  timestamp: {
    fontSize: '12px',
    color: '#888',
    marginTop: '5px',
    textAlign: 'center',
    display: 'block',
    paddingTop: '4px',
  },

  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
};

export default AdminChat;
