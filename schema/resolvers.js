
const pubsub = require('../utils/pubsub');
const { withFilter } = require('graphql-subscriptions');
const Mutation = require('./mutation');
const Query = require('./query');

module.exports = {
    Query,
    Mutation,
    Subscription: {
        Bid: {
            subscribe: withFilter(() => pubsub.asyncIterator('Bid'), (payload, variables) => {
                return payload.Bid.node.auctionId.toString() === variables.filter.auctionId;
        })},
    },
    User: {
        id: root => root._id || root.id,
        auctions: async (root, data, {loaders: {auctionByOwnersLoader}}) => {
            return await auctionByOwnersLoader.load(root.id);
        },
        participations: async (root, data, {loaders: {auctionByParticipantsLoader}}) => {
            return await auctionByParticipantsLoader.load(root.id);
        },
        wins: async (root, data, {loaders: {auctionByWinnersLoader}}) => {
            return await auctionByWinnersLoader.load(root.id);
        },
        transactions: async (root,data,{Transaction}) => {
            return 
        }
    },
    Auction: {
        id: root => root._id || root.id,
        by: async (root,data,{loaders: {userAuctionByID}}) => {
            return await userAuctionByID.load(root.byId);
        },
        winner: async (root,data,{loaders: {userAuctionWinner}}) => {
            if(!root.winnerId) {
                return
            }
            return await userAuctionWinner.load(root.winnerId);
        },
        bidders: async (root,data,{loaders: {bidsAuction}}) => {
            return await bidsAuction.load(root.id);
        }
    },
    Transaction: {
        id: root => root._id || root.id,
        auction: async (root,data,{loaders: {auctionByIDLoader}}) => {
            return await auctionByIDLoader.load(root.auctionId);
        },
        owner: async (root,data,{User}) => {
            return User.find({transactions: root.id});
        },
        winner: async (root,data,{User}) => {
            return awaitUser.find({transactions: root.id});
        }
    },
    Bid: {
        id: root => root._id || root.id,
        by: async (root,data,{loaders: {userBid}}) => {
            return await userBid.load(root.byId);
        },
        auction: async (root,data,{loaders: {auctionBid}}) => {
            return await auctionBid.load(root.auctionId);
        }
    }
};