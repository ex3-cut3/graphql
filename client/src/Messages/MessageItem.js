import React, {useCallback, useState} from 'react';
import {AddReview} from '../Reviews/AddReview';
import {ReviewList} from '../Reviews/ReviewList';
import './Message.css';
import {useMutation, useSubscription} from '@apollo/client';
import {specifiedHoursToConvertTimezone} from '../utils/constants';
import {CREATE_DISLIKE, CREATE_LIKE} from "../queries/Mutation";
import {NEW_DISLIKE, NEW_LIKE, NEW_REVIEW} from "../queries/Subscription";

export const MessageItem = ({message, totalCountMsg}) => {
    const [isAddingReview, setIsAddingReview] = useState(false);
    const {
        data: messageSub,
        loading: likesLoading,
        error: likesError,
    } = useSubscription(NEW_LIKE);

    const {
        data: messageSubDis,
        loading: dislikesLoading,
        error: dislikesError,
    } = useSubscription(NEW_DISLIKE);

    const {
        data: newReviewMessage,
        loading: newReviewMessageLoading,
        error: newReviewMessageError,
    } = useSubscription(NEW_REVIEW);

    const [createLike, {loading: likeLoading, error: likeError}] = useMutation(CREATE_LIKE);
    const [createDislike, {loading: dislikeLoading, error: dislikeError}] = useMutation(CREATE_DISLIKE);

    const handleReviewSubmit = useCallback(() => setIsAddingReview(false), []);

    async function handleLike(e) {
        e.target.disabled = true;
        await createLike({
            variables: {
                messageId: message.id,
            },
        });
    }

    async function handleDislike(e) {
        e.target.disabled = true;
        await createDislike({
            variables: {
                messageId: message.id,
            },
        });
    }

    if (likeError || dislikeError || likesError || dislikesError) {
        console.log(likeError, dislikeError, likesError, dislikesError);
        return (<h1>Something bad happened...Try later</h1>);
    }

    const date = new Date(+message.createdAt + specifiedHoursToConvertTimezone(new Date().getTimezoneOffset() / 60));

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function checkIfAvailableNewReviews() {
       return  newReviewMessageLoading || !newReviewMessage.newReviews.reviews || newReviewMessage.id !== message.id
    }

    return (
        <div className = "item">
            <div style = {{position: 'absolute', top: '2%', right: '5%'}}>#{message.id.slice(-5)}</div>
            <p style = {{fontSize: '1.5rem'}}>{message.text}</p>
            <h4>Likes: {(likesLoading || !messageSub.likes) ? message.likes : messageSub.likes},
                dislikes: {(dislikesLoading || !messageSubDis.dislikes) ? message.dislikes : messageSubDis.dislikes}</h4>
            <div style = {{display: 'flex', gap: '15px'}}>
                <button type = "button" onClick = {handleLike}>Like</button>
                <button type = "button" onClick = {handleDislike}>Dislike</button>
            </div>
            <ReviewList
                reviews = {checkIfAvailableNewReviews() ? message.reviews : newReviewMessage.newReviews.reviews}/>
            {
                isAddingReview ? (
                    <AddReview
                        messageId = {message.id}
                        totalCountMsg = {totalCountMsg}
                        onReviewSubmit = {handleReviewSubmit}
                    />
                ) : (
                    <button
                        className = "add-review"
                        type = "button"
                        onClick = {() => setIsAddingReview(true)}
                    >
                        Add review
                    </button>
                )
            }
            <div style = {{
                position: 'absolute',
                top: '2%',
                left: '5%',
                fontSize: '0.7rem',
                pointerEvents: 'none',
            }}>{padTo2Digits(date.getUTCMonth() + 1)}.{padTo2Digits(date.getUTCDate())} // {padTo2Digits(date.getUTCHours())}:{padTo2Digits(date.getUTCMinutes())}:{padTo2Digits(date.getUTCSeconds())}</div>
        </div>
    );
};
