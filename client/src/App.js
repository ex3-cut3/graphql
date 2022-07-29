import React, {useState} from 'react';
import { Route } from 'react-router-dom'
import { Routes } from 'react-router';
import { Header } from './Header/Header';
import { AddMessage } from './Messages/AddMessage';
import { MessageList } from './Messages/MessageList';

export function App() {
    const [totalMessagesCount, setTotalMessagesCount] = useState(3);

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<MessageList totalMessagesControl={{totalMessagesCount, setTotalMessagesCount}}/>} />
                <Route path="/add" element={<AddMessage totalMessagesControl={{totalMessagesCount, setTotalMessagesCount}}/>} />
            </Routes>
        </div>
    );
}
