const { messages } = require('../Message');
const { reviews } = require('../Review');

const Query = {
    messages,
    reviews,
    version: () => '1.0',
};

module.exports = Query;
