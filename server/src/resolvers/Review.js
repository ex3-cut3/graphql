// Queries
const reviews = async (_parent, args, context, _info) => context.prisma.review.findMany();

// Mutations
const createReview = async (_parent, args, context) => {
    try {
        const {review: {text, messageId}} = args;

        const isMessageExists = await context.prisma.message.findFirst({
            where: {
                id: messageId,
            },
            select: {id: true},
        }).then(Boolean);

        if (!isMessageExists) {
            throw new Error(`Message with id ${messageId} does not exist`);
        }
        const review = await context.prisma.review.create({
            data: {
                text,
                message: {
                    connect: {id: messageId},
                },
            },
        });
        context.pubsub.publish('NEW_REVIEW', await context.prisma.message.findFirst({
            where: {
                id: messageId,
            },
        }));

        return review;
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    reviews,
    createReview,
};
