const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    auctionId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    byId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    updated: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Bid',BidSchema);