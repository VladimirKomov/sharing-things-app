import axios from 'axios';
import {ChatMessage} from "../../common/models/chat.model.ts";


const API_URL = 'http://127.0.0.1:8000/api/chat';

export const fetchChatHistory = async (
    roomName?: string,
    receiver?: string
): Promise<ChatMessage[]> => {
    try {
        const url = roomName
            ? `${API_URL}/history/${roomName}/`
            : `${API_URL}/history/`;
        const response = await axios.get<ChatMessage[]>(url, {
            params: receiver ? { receiver } : {},
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
};


export const createChat = async (participants: number[]): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/create/`,
            { participants },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};

