import {gql} from "@apollo/client";

export const CREATE_MESSAGE = gql`
    mutation createMessage($message: MessageInput!) {
        createMessage(message: $message) {
            id
            text
            createdAt
        }
    }
`;

export const CREATE_REVIEW = gql`
    mutation createReview($review: ReviewInput!) {
        createReview(review: $review) {
            id
            text
        }
    }
`;
export const CREATE_LIKE = gql`
    mutation createLike($messageId: String!) {
        createLike(messageId: $messageId){
            text
            likes
            dislikes
        }
    }
`;
export const CREATE_DISLIKE = gql`
    mutation createDislike($messageId: String!) {
        createDislike(messageId: $messageId){
            text
            likes
            dislikes
        }
    }
`;