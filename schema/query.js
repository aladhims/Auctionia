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
  getAuctionsByFilter: async (root, { text, category }, { Auction, user }) => {
    if (text.split("").length > 0) {
      console.log(text);
      if (category && category.length > 0) {
        return await Auction.find(
          { $text: { $search: text }, category: { $in: category } },
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
      } else {
        return await Auction.find(
          { $text: { $search: text } },
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
      }
    } else {
      if (category && category.length > 0) {
        return await Auction.find({ category: { $in: category } });
      }
    }
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
