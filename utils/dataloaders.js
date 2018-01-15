const DataLoader = require("dataloader");

const loaders = ({ User, Auction, Transaction, Bid }) => ({
  auctionByIDLoader: new DataLoader(
    keys =>
      Promise.all(keys.map(async key => await Auction.find({ _id: key }))),
    { cacheKeyFn: key => key.toString() }
  ),
  auctionByParticipantsLoader: new DataLoader(
    keys =>
      Promise.all(
        keys.map(async key => await Auction.find({ biddersId: key }))
      ),
    { cacheKeyFn: key => key.toString() }
  ),
  auctionByWinnersLoader: new DataLoader(
    keys =>
      Promise.all(keys.map(async key => await Auction.find({ winnerId: key }))),
    { cacheKeyFn: key => key.toString() }
  ),
  auctionByOwnersLoader: new DataLoader(
    keys =>
      Promise.all(keys.map(async key => await Auction.find({ byId: key }))),
    { cacheKeyFn: key => key.toString() }
  ),
  userAuctionByID: new DataLoader(
    keys =>
      Promise.all(
        keys.map(async key => {
          const users = await User.findById(key);
          return users;
        })
      ),
    { cacheKeyFn: key => key.toString() }
  ),
  userAuctionWinner: new DataLoader(
    keys =>
      Promise.all(keys.map(async key => await User.findById(key))),
    { cacheKeyFn: key => key.toString() }
  ),
  userTransactionID: new DataLoader(
    keys =>
      Promise.all(
        keys.map(
          async key =>
            await Transaction.find({
              $or: [{ owner: key }, { winner: key }]
            })
        )
      ),
    { cacheKeyFn: key => key.toString() }
  ),
  bidsAuction: new DataLoader(
    keys =>
      Promise.all(
        keys.map(
          async key =>
            await Bid.find({ auctionId: key })
              .sort("-amount")
        )
      ),
    { cacheKeyFn: key => key.toString() }
  ),
  userBid: new DataLoader(
    keys => Promise.all(keys.map(async key => await User.findById(key))),
    { cacheKeyFn: key => key.toString() }
  ),
  auctionBid: new DataLoader(
    keys => Promise.all(keys.map(async key => await Auction.findById(key))),
    { cacheKeyFn: key => key.toString() }
  )
});

module.exports = loaders;
