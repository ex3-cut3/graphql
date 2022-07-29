import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from '@apollo/client';
import {MessageItem} from './MessageItem';
import {increaseMessagesBy, orderBy} from '../utils/constants';
import './Message.css';
import {GET_MESSAGES} from "../queries/Query";
import {NEW_MESSAGE} from "../queries/Subscription";

export const MessageList = ({totalMessagesControl}) => {
    const [query, setQuery] = useState('');
    const [sortType, setSortType] = useState('');
    const [skip, setSkip] = useState(0);
    const buttonLoadMore = useRef(null);
    const {totalMessagesCount, setTotalMessagesCount} = totalMessagesControl;

    const {loading, error, data, subscribeToMore, refetch} = useQuery(GET_MESSAGES, {
        variables: {orderBy, skip, take: totalMessagesCount},
        notifyOnNetworkStatusChange: true,
    });
    useEffect(() => {

    }, [loading, totalMessagesCount]);

    useEffect(() => {
        subscribeToMore({
            document: NEW_MESSAGE,
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const {newMessage} = subscriptionData.data;
                return {
                    ...prev,
                    messages: {
                        ...prev.messages,
                        messageList: [{...newMessage, reviews: []}, ...prev.messages.messageList],
                    },
                };
            },
        });
    }, [subscribeToMore]);

    if (loading) {
        return <div>Is Loading...</div>;
    }

    if (error) {
        let msg = 'Error';
        error.graphQLErrors.forEach(err => {
            msg += `${err.message}\n`;
        });
        return (
            <div>
                {msg}
            </div>
        );
    }

    async function handleSort(e) {
        setSortType(e.target.value);
        const {value} = e.target;
        if (!value) return;
        const orderBy = {[value]: 'desc'};
        await refetch({orderBy});
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (!query) await refetch({skip, take: totalMessagesCount});
        await refetch({
            filter: query,
        });
    }
    let timeoutID;

    const handleLoadMessages = async (e) => {
        clearTimeout(timeoutID);
        if (data.messages.count <= totalMessagesCount) {
            buttonLoadMore.current.textContent = 'That`s all messages at the moment';
            timeoutID = setTimeout(() => {
                buttonLoadMore.current.textContent = 'Load more messages';
            }, 1500);
            return;
        }
        else if (data.messages.count > totalMessagesCount) {
            buttonLoadMore.current.textContent = 'Load more messages';
        }
        e.target.textContent = 'Loading...';
        setTotalMessagesCount((prev) => prev + increaseMessagesBy);
        await refetch({take: totalMessagesCount});
    };

    return (
        <>
            <h5 style={{textAlign: 'center', margin: '5px 0'}}>Default sorting: messages text in asc., to enable pagination, add more than 3 messages; to see messages dynamically update everywhere, enter in messages with lowest uft code (e.g numbers) or load all messages</h5>
            <div style = {{justifyContent: 'center', gap: '10px', display: 'flex'}}>
                <form onSubmit = {handleSearch}>
                    <input type = "text" style = {{justifySelf: 'center'}} value = {query}
                           onChange = {(e) => setQuery(e.target.value)} placeholder = 'Any text to search...'/>
                    <button type = 'submit'>Search</button>
                </form>
                <select style = {{display: 'flex'}} name = "sortType" value = {sortType} onChange = {handleSort}>
                    <option value = "" disabled>sort</option>
                    <option value = "likes">From highest to lowest likes</option>
                    <option value = "dislikes">From highest to lowest dislikes</option>
                    <option value = "createdAt">From newest message to last</option>
                </select>
            </div>
            <button ref = {buttonLoadMore} onClick = {handleLoadMessages}>Load more messages
            </button>
            <div className = "container">
                {data.messages.messageList.length === 0 &&
                    <h1 style = {{margin: '10px auto'}}>No messages found for your request</h1>}
                {
                    data.messages.messageList.map((message) => (
                        <MessageItem key = {message.id} totalCountMsg = {totalMessagesCount} message = {message}/>
                    ))
                }
            </div>
        </>

    );
};
