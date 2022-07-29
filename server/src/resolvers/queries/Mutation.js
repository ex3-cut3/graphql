const { createMessage, createLike, createDislike } = require('../Message');
const { createReview } = require('../Review');

const Mutation = {
    createMessage,
    createReview,
    createLike,
    createDislike,
};

module.exports = Mutation;
