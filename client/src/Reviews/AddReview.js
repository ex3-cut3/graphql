import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {orderBy} from '../utils/constants';
import './Review.css';
import {GET_MESSAGES} from "../queries/Query";
import {CREATE_REVIEW} from "../queries/Mutation";

const updateMessageStore = (messageId, totalCountMsg) => (cache, { data: { createReview } }) => {
    console.log(totalCountMsg);
    const { messages } = cache.readQuery({
        query: GET_MESSAGES,
        variables: { orderBy, skip: 0, take: totalCountMsg },
    });

    const updatedMessages = messages.messageList.map(item => {
        if (item.id === messageId) {
            return {
                ...item,
                reviews: [...item.reviews, createReview],
            };
        }

        return item;
    });

    cache.writeQuery({
        query: GET_MESSAGES,
        variables: { orderBy },
        data: { messages: { ...messages, messageList: updatedMessages } },
    });
};

export const AddReview = ({ messageId, onReviewSubmit, totalCountMsg }) => {
    const [text, setText] = useState('');

    const [createReview, { loading, error }] = useMutation(CREATE_REVIEW, {
        update: updateMessageStore(messageId, totalCountMsg),
    });

    const handleReviewCreate = async () => {
        if (!text) return;
        await createReview({
            variables: {
                review: { text, messageId },
            },
        });
        onReviewSubmit();
    };

    if (loading) return 'Submitting...';
    if (error) { console.log(error.networkError);
        return `Submission error! ${error.message}`;
    }

    return (
        <div className="add-review">
            <div className="add-review">
                <div>Type text</div>
                <input className="add-review" name="Text" type="text" onChange={e => setText(e.target.value)} />
            </div>
            <div className="add-review">
                <button className="review-button" type="button" onClick={handleReviewCreate}>
                    Submit review
                </button>
                <button className="review-button" type="button" onClick={onReviewSubmit}>
                    Close
                </button>
            </div>
        </div>
    );
};
