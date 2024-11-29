import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const AdminChat = () => {
  const [messages, setMessages] = useState([]); // 모든 메시지를 배열로 저장
  const [stompClient, setStompClient] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const inputValueRef = useRef('');
  const adminName = "새로고침";

  const subscribedChatRooms = useRef(new Set());

  useEffect(() => {
    if (stompClient) return;

    const socket = new SockJS('https://refresh-f5-server.o-r.kr/ws/chat');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);

      client.subscribe('/topic/admin/new-room', (message) => {
        const newRoom = JSON.parse(message.body);
        console.log('New room created:', newRoom);

        if (newRoom.chatId && !subscribedChatRooms.current.has(newRoom.chatId)) {
          subscribedChatRooms.current.add(newRoom.chatId);

          client.subscribe(`/topic/chat/${newRoom.chatId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            handleReceivedMessage(receivedMessage, newRoom.chatId);
          });

          setChatList((prevList) => [
            ...prevList,
            { sender: newRoom.sender, content: '', unread: 0, chatId: newRoom.chatId },
          ]);
        }
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [stompClient]);

  const handleReceivedMessage = (receivedMessage, chatId) => {
    if (!receivedMessage.time) {
      receivedMessage.time = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    setMessages((prevMessages) => {
      // 중복 메시지 방지
      if (!prevMessages.some((msg) => msg.chatId === chatId && msg.content === receivedMessage.content)) {
        return [...prevMessages, { ...receivedMessage, chatId }];
      }
      return prevMessages;
    });

    setChatList((prevList) =>
      prevList.map((chat) =>
        chat.chatId === chatId
          ? { ...chat, content: receivedMessage.content, unread: chat.unread + 1 }
          : chat
      )
    );
  };

  const sendMessage = () => {
    if (inputValueRef.current.trim() && stompClient && selectedUser) {
      const message = {
        chatId: selectedUser.chatId,
        content: inputValueRef.current,
        sender: adminName,
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      stompClient.send('/app/chat', {}, JSON.stringify(message));

      setMessages((prevMessages) => [...prevMessages, message]);
      inputValueRef.current = '';
      inputRef.current.value = '';
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setChatList((prevList) =>
      prevList.map((chat) =>
        chat.chatId === user.chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredMessages = messages.filter((msg) => msg.chatId === selectedUser?.chatId);

  const ChatList = () => (
    <Card title="채팅 목록" style={styles.chatList} bordered>
      <List
        itemLayout="horizontal"
        dataSource={chatList}
        renderItem={(chat) => (
          <List.Item
            style={{
              backgroundColor: selectedUser?.chatId === chat.chatId ? '#e0f7fa' : 'white',
              cursor: 'pointer',
              borderRadius: '5px',
              margin: '5px 0',
              padding: '10px',
            }}
            onClick={() => selectUser(chat)}
          >
            <List.Item.Meta
              avatar={<Avatar icon="user" />}
              title={<strong>{chat.sender}</strong>}
              description={chat.content}
            />
            {chat.unread > 0 && selectedUser?.chatId !== chat.chatId && (
              <span style={styles.unreadBadge}>안 읽음: {chat.unread}</span>
            )}
          </List.Item>
        )}
      />
    </Card>
  );

  const ChatWindow = () => (
    <Card
      title={selectedUser ? `${selectedUser.sender}와의 대화` : '유저를 선택하세요'}
      style={styles.chatWindow}
      bordered
    >
      <div style={styles.messageContainer} ref={chatContainerRef}>
        {filteredMessages.map((msg, index) => (
          <div key={index} style={msg.sender === adminName ? styles.adminMessage : styles.userMessage}>
            {msg.sender !== adminName && (
              <div style={styles.userAvatarContainer}>
                <Avatar style={styles.outlineAvatar} />
                <div style={styles.senderName}>{msg.sender}</div>
              </div>
            )}
            <div style={msg.sender === adminName ? styles.adminBubble : styles.userBubble}>
              <div style={styles.messageContent}>{msg.content}</div>
            </div>
            <span style={styles.timestamp}>{msg.time}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          className="admin-chat-input"
          type="text"
          onChange={(e) => (inputValueRef.current = e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          style={styles.input}
          ref={inputRef}
          disabled={!selectedUser}
          autoComplete="off"
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