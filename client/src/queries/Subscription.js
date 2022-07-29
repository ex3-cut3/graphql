import {gql} from "@apollo/client";

export const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            id
            text
            likes
            dislikes
            createdAt
        }
    }
`;
export const NEW_LIKE = gql`
    subscription newLike {
        newLike {
            id
            text
            likes
            dislikes
            createdAt
        }
    }
`;
export const NEW_DISLIKE = gql`
    subscription newDislike {
        newDislike {
            id
            text
            likes
            dislikes
            createdAt
        }
    }
`;

export const NEW_REVIEW = gql`
    subscription newReviews {
        newReviews {
            id
            reviews {
                id
                text
            }
        }
    }
`;