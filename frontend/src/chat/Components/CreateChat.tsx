import React, { useState } from 'react';
import {createChat} from "../api/chatApi.ts";


const CreateChat: React.FC = () => {
    const [participants, setParticipants] = useState<string>(''); // User IDs as comma-separated string
    const [error, setError] = useState<string | null>(null);

    const handleCreateChat = async () => {
        try {
            const ids = participants.split(',').map((id) => parseInt(id.trim()));
            const chat = await createChat(ids);
            console.log('Chat created:', chat);
            setError(null);
        } catch (err) {
            setError('Failed to create chat. Check participants.');
        }
    };

    return (
        <div>
            <h2>Create New Chat</h2>
            <input
                type="text"
                placeholder="Enter participant IDs (comma-separated)"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
            />
            <button onClick={handleCreateChat}>Create Chat</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateChat;
