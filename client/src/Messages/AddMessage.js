import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigate } from 'react-router';
// eslint-disable-next-line import/named
import { orderBy } from '../utils/constants';
import './Message.css';
import {GET_MESSAGES} from "../queries/Query";
import {CREATE_MESSAGE} from "../queries/Mutation";

export const AddMessage = ({totalMessagesControl}) => {
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const {totalMessagesCount, setTotalMessagesCount} = totalMessagesControl;

    const [createMessage, { loading, error }] = useMutation(CREATE_MESSAGE, {
        refetchQueries: [
            { query: GET_MESSAGES, variables: { orderBy, skip: 0, take: totalMessagesCount } },
        ],
        onCompleted: () => {
            navigate('/');
        },
    });

    const handleMessageCreate = async () => {
        await createMessage({
            variables: {
                message: { text },
            },
        });
    };

    if (loading) return 'Submitting...';
    if (error) {
        console.log(error.graphQLErrors);
        return `Submission error! ${error.message}`;
    }

    return (
        <div className="center-container">
            <div>
                <div className="product-input">Message</div>
                <input className="product-input" name="Title" type="text" onChange={e => setText(e.target.value)} />
            </div>
            <div className="submit-product">
                <button type="button" onClick={handleMessageCreate}>
                    Post a message
                </button>
            </div>
        </div>
    );
};
