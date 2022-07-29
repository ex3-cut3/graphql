const { newMessage, newLike, newDislike, newReviews } = require('../Message');

const Subscription = {
    newMessage,
    newLike,
    newDislike,
    newReviews,
};

module.exports = Subscription;
