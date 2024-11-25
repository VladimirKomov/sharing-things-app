import React, { useState, useEffect, useRef } from 'react';
import {ChatMessage} from "../../common/models/chat.model.ts";
import {fetchChatHistory} from "../api/chatApi.ts";


interface ChatProps {
    roomName?: string;
    receiver?: string;
}

const Chat: React.FC<ChatProps> = ({ roomName, receiver }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    // Загружаем историю сообщений
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = roomName
                    ? await fetchChatHistory(roomName)
                    : await fetchChatHistory(undefined, receiver);
                setMessages(data);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();
    }, [roomName, receiver]);

    // Подключаем WebSocket
    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName || receiver}/`);

        ws.onmessage = (event) => {
            const data: ChatMessage = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        ws.onerror = (error) => console.error('WebSocket error:', error);

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [roomName, receiver]);

    // Прокрутка к последнему сообщению
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Отправка нового сообщения
    const sendMessage = () => {
        if (socket && newMessage.trim()) {
            socket.send(
                JSON.stringify({
                    message: newMessage,
                    sender: 'user1', // Замените на текущего пользователя
                    receiver: receiver || roomName,
                })
            );
            setNewMessage('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px', border: '1px solid #ccc', padding: '10px' }}>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ marginBottom: '5px' }}>
                        <strong>{msg.sender}</strong>: {msg.message}
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, marginRight: '5px' }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
