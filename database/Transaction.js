const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    auction: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    winnerId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    ownerOK: {
        type: Boolean,
        default: false
    },
    winnerOK: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['PROGRESS','COMPLETED','CANCELED'],
        default: 'PROGRESS'
    },
});

module.exports = mongoose.model('Transaction',TransactionSchema);