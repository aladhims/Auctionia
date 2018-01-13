module.exports = {
  allAuctions: async (root, data, { Auction }) => {
    return await Auction.find({});
  },
  allUsers: async (root, data, { User }) => {
    return await User.find();
  },
  allTransactions: async (root, data, { Transaction }) => {
    return await Transaction.find();
  },
  getUser: async (root, { id }, { User }) => {
    return await User.findById(id);
  },
  getAuction: async (root, { id }, { Auction, user }) => {
    const auction = await Auction.findById(id);

    return auction;
  },
  getAuctionsByCategory: async (root, { category }, { Auction, user }) => {
    const auctions = await Auction.find({ category: {$in: category} });

    return auctions;
  },
  currentUser: (root, { id }, { user }) => {
    if (!user) {
      throw new Error("Unauthorized");
    }
    return user;
  },
  getBids: async (root, { auctionId }, { Bid, user }) => {
    if (!user) {
      throw new Error("Unauthorized");
    }

    const theBids = await Bid.find({ auctionId });
    return theBids;
  }
};
