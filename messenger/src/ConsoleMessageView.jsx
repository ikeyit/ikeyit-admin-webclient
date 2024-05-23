import { useState, useEffect } from 'react';
import {ajax} from "../../common/ajax.js";

export default function ConsoleMessageView() {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        const data = await ajax.get('/messenger/api/console-messages');
        setMessages(data);
    };

    return (
        <div>
            <h1>Message Queue</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        {message.receiver}, {message.text}, Sent at {message.createTime}
                    </li>
                ))}
            </ul>
        </div>
    );
}
