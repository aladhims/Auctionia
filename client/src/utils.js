export function toRp(angka) {
  var rev = parseInt(angka, 10)
    .toString()
    .split("")
    .reverse()
    .join("");
  var rev2 = "";
  for (var i = 0; i < rev.length; i++) {
    rev2 += rev[i];
    if ((i + 1) % 3 === 0 && i !== rev.length - 1) {
      rev2 += ".";
    }
  }
  return (
    "Rp. " +
    rev2
      .split("")
      .reverse()
      .join("") +
    ",00"
  );
}

export const updateQuery = (previous, { subscriptionData }) => {
  const mutation = subscriptionData.data.Bid.mutation;
  if (mutation === "UPDATED") {
    const bidData = subscriptionData.data.Bid;
    const prevBid = previous.getAuction.bidders;
    const newBidIndex = prevBid.findIndex(bids => bids.id === bidData.node.id);
    const newBid = {
      ...bidData.node,
      by: {
        __typename: bidData.node.__typename,
        photo: bidData.node.photo,
        name: bidData.node.name
      }
    };

    console.log(newBid);
    const newBids = [
      ...prevBid.slice(0, newBidIndex),
      newBid,
      ...prevBid.slice(newBidIndex + 1)
    ];

    const result = {
      ...previous,
      getAuction: {
        ...previous.getAuction,
        bidders: newBids.sort((a, b) => {
          return b.amount - a.amount;
        })
      }
    };
    return result;
  } else if (mutation === "CREATED") {
    const bid = subscriptionData.data.Bid;
    const newBid = {
      ...bid.node,
      by: {
        __typename: bid.node.__typename,
        photo: bid.node.photo,
        name: bid.node.name
      }
    };

    delete newBid.photo, newBid.name;
    const newBids = [newBid, ...previous.getAuction.bidders];

    const result = {
      ...previous,
      getAuction: {
        ...previous.getAuction,
        bidders: newBids.sort((a, b) => {
          return b.amount - a.amount;
        })
      }
    };
    return result;
  } else if (mutation === "DELETED") {
    const bid = subscriptionData.data.Bid.node;
    const prevBid = previous.getAuction.bidders;

    const index = prevBid.findIndex(b => b.id === bid.id);

    const newBids = [...prevBid.slice(0, index), ...prevBid.slice(index + 1)];

    const result = {
      ...previous,
      getAuction: {
        ...previous.getAuction,
        bidders: newBids.sort((a, b) => {
          return b.amount - a.amount;
        })
      }
    };

    return result;
  }
};
