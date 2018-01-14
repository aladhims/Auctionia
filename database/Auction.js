const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuctionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photos: [{
    type: String,
    default:
      "http://www.movehut.co.uk/news/wp-content/uploads/2013/08/Auction-Fever-Hits-London.jpg"
  }],
  initialprice: {
    type: Number,
    required: true,
    default: 0
  },
  currentprice: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ["Pakaian", "Kendaraan", "Emas", "Antik", "Kerajinan"],
    required: true
  },
  biddersId: [{ type: Schema.Types.ObjectId }],
  posted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  start: {
    type: Date,
    required: true,
    default: Date.now
  },
  end: {
    type: Date,
    required: true,
    default: Date.now
  },
  byId: Schema.Types.ObjectId,
  winnerId: Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ["PROGRESS", "COMPLETED", "CANCELED"],
    default: "PROGRESS"
  }
});

AuctionSchema.pre("save", function(next) {
  if (this.isModified("initialprice")) {
    this.currentprice = this.initialprice;
  }
  next();
});

AuctionSchema.index({title: 'text', description: 'text'});

module.exports = mongoose.model("Auction", AuctionSchema);
