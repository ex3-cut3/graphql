/*
    parent - This is the return value of the resolver for this field's parent (the resolver for a parent field always executes before the resolvers for that field's children).
    args - This object contains all GraphQL arguments provided for this field.
    context - This object is shared across all resolvers that execute for a particular operation. Use this to share per-operation state, such as authentication information and access to data sources.
    info - This contains information about the execution state of the operation
*/
// Queries
const messages = async (_parent, args, context, _info) => {

    try {
        const {filter, skip, take, orderBy} = args;

        const where = filter ? {
            text: filter,
        } : {};

        const messageList = await context.prisma.message.findMany({
            where,
            include: {
                reviews: true,
            },
            skip,
            take,
            orderBy,
        });

        const count = await context.prisma.message.count();

        return {
            messageList,
            count,
        };
    } catch (e) {
        console.log(e);
    }
};

// Mutations
const createMessage = async (_parent, args, context) => {
    try {
        const {message} = args;
        console.log(message);
        const createdProduct = await context.prisma.message.create({data: message});
        context.pubsub.publish('NEW_MESSAGE', createdProduct);
        return createdProduct;
    } catch (e) {
        console.log(e);
    }
};

const createLike = async (_parent, args, context) => {
    console.log(args);
    const updatedMessage = await context.prisma.message.update({
        where: {id: args.messageId},
        data: {likes: {increment: 1}}
    });
    context.pubsub.publish('NEW_LIKE', updatedMessage);
    return updatedMessage;
};
const createDislike = async (_parent, args, context) => {
    const updatedMessage = await context.prisma.message.update({
        where: {id: args.messageId},
        data: {dislikes: {increment: 1}},
    });
    context.pubsub.publish('NEW_DISLIKE', updatedMessage);
    return updatedMessage;
};


// Subscriptions

const newMessageSubscribe = (_parent, _args, context) => context.pubsub.subscribe('NEW_MESSAGE');
const newMessage = {
    subscribe: newMessageSubscribe,
    resolve: payload => payload,
};

const newReviewSubscribe = (_parent, _args, context) => context.pubsub.subscribe('NEW_REVIEW');
const newReviews = {
    subscribe: newReviewSubscribe,
    resolve: payload => payload,
};

const newLikeSubscribe = (_parent, _args, context) => context.pubsub.subscribe('NEW_LIKE');
const newLike = {
    subscribe: newLikeSubscribe,
    resolve: payload => payload,
};

const newDislikeSubscribe = (_parent, _args, context) => context.pubsub.subscribe('NEW_DISLIKE');
const newDislike = {
    subscribe: newDislikeSubscribe,
    resolve: payload => payload,
};

module.exports = {
    messages,
    createMessage,
    createLike,
    createDislike,
    newMessage,
    newLike,
    newDislike,
    newReviews,
};
