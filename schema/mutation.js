const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pubsub = require("../utils/pubsub");
const config = require("../config/config");
const CronJob = require('cron').CronJob;

module.exports = {
  createUser: async (
    root,
    { name, auth: { username, password, email }, phone, photo },
    { User }
  ) => {
    const user = new User({ name, username, password, email });
    if (phone) user.phone = phone;
    if (photo) user.photo = photo;

    const newUser = await user.save();

    const payload = {
      id: newUser.id
    };

    const token = jwt.sign(payload, config.JWT_KEY, {
      expiresIn: 7 * 24 * 60 * 60
    });

    return { token, user: newUser };
  },
  authenticateUser: async (root, { username, password }, { User }) => {
    const theUser = await User.findOne({ username });
    if (theUser) {
      const match = await bcrypt.compare(password, theUser.password);
      if (match) {
        const payload = {
          id: theUser.id
        };
        const token = jwt.sign(payload, config.JWT_KEY, {
          expiresIn: 7 * 24 * 60 * 60
        });
        return { token, user: theUser };
      } else {
        throw new Error("Username/Password doesn't match");
      }
    } else {
      throw new Error("Username/Password doesn't match");
    }
  },
  createAuction: async (
    root,
    { title, description, initialprice, category, start, end, photos},
    {
      Auction,
      Bid,
      user,
      loaders: {
        bidsAuction,
        auctionByOwnersLoader,
        auctionByParticipantsLoader
      }
    }
  ) => {
    if (!user) {
      throw new Error("Unauthorized");
    }
    const auction = new Auction({
      title,
      description,
      initialprice,
      category,
      start,
      end,
      byId: user.id,
      photos
    });
    bidsAuction.clearAll();
    auctionByOwnersLoader.clearAll();
    auctionByParticipantsLoader.clearAll();
    const savedAuction = await auction.save();
    var job = new CronJob(new Date(end), async function() {
      const bids = await Bid.find({ auctionId: savedAuction._id }).sort("-amount");
      
      const winnerBid = bids[0];
      await Auction.findByIdAndUpdate(savedAuction._id,{winnerId:winnerBid.byId, status: "COMPLETED"});

      }, function () {
      },
      true, /* Start the job right now */
      "Asia/Jakarta" /* Time zone of this job. */
    );
    return savedAuction;
  },
  putBid: async (
    root,
    { auctionId, amount },
    { Bid, Auction, user, loaders: { bidsAuction } }
  ) => {
    if (!user) {
      throw new Error("Unauthorized");
    }
    const updated = Date.now();
    const bid = await new Bid({
      auctionId,
      amount,
      byId: user._id,
      updated
    }).save();

    pubsub.publish("Bid", {
      Bid: {
        mutation: "CREATED",
        node: {
          id: bid._id,
          auctionId: bid.auctionId,
          byId: bid.byId,
          amount: bid.amount,
          updated: bid.updated,
          name: user.name,
          photo: user.photo
        }
      }
    });

    const test = await Auction.findByIdAndUpdate(
      auctionId,
      { $addToSet: { biddersId: user._id } },
      {
        new: true
      }
    );
    bidsAuction.clearAll();

    return bid;
  },
  updateBid: async (
    root,
    { amount, id },
    { Bid, user, loaders: { bidsAuction } }
  ) => {
    const oldBid = await Bid.findById(id);
    oldBid.amount = amount;
    oldBid.updated = Date.now();
    const bid = await oldBid.save();
    pubsub.publish("Bid", {
      Bid: {
        mutation: "UPDATED",
        node: {
          id: bid._id,
          auctionId: bid.auctionId,
          byId: bid.byId,
          amount: bid.amount,
          updated: bid.updated,
          name: user.name,
          photo: user.photo
        }
      }
    });
    bidsAuction.clearAll();
    return bid;
  },
  deleteBid: async (root, { id }, { Bid, user, loaders: { bidsAuction } }) => {
    const bid = await Bid.findByIdAndRemove(id);
    pubsub.publish("Bid", {
      Bid: {
        mutation: "DELETED",
        node: {
          id: bid._id,
          auctionId: bid.auctionId,
          byId: bid.byId,
          amount: bid.amount,
          updated: bid.updated,
          name: user.name,
          photo: user.photo
        }
      }
    });
    bidsAuction.clearAll();
    return bid ? true : false;
  }
};
