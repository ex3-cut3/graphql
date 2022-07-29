import {gql} from "@apollo/client";

export const GET_MESSAGES = gql`
    query getMessages($orderBy: MessageOrderByInput!, $skip: Int, $take: Int, $filter: String) {
        messages(orderBy: $orderBy, skip: $skip, take: $take, filter: $filter) {
            messageList {
                id
                text
                likes
                dislikes
                createdAt
                reviews {
                    id
                    text
                }
            }
            count
        }
    }
`;