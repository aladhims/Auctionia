const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');


const schema = `

    scalar Date

    input AUTH {
        username: String!
        email: String!
        password: String!
    }

    type AuthPayload {
        user: User!
        token: String!
    }

    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        password: String!
        lepay: Int!
        phone: String
        photo: String!
        auctions: [Auction!]
        transactions: [Transaction!]
        participations: [Auction!]
        wins: [Auction!]
        join: Date!
    }

    type Auction {
        id: ID!
        title: String!
        description: String!
        photos: [String!]!
        initialprice: Int!
        currentprice: Int!
        category: categor
        posted: Date!
        start: Date!
        end: Date!
        by: User
        winner: User
        byId: ID!
        winnerId: ID!
        bidders: [Bid!]
        status: status!
    }

    type Transaction {
        id: ID!
        auctionId: ID!
        auction: Auction!
        ownerId: ID!
        winnerId: ID!
        owner: User!
        winner: User!
        ownerOK: Boolean!
        winnerOK: Boolean!
        status: status!
    }

    type Bid {
        id: ID!
        auctionId: ID!
        auction: Auction
        byId: ID!
        by: User
        amount: Int!
        updated: Date!
    }

    enum status {
        PROGRESS
        COMPLETED
        CANCELED
    }
    
    enum categor {
        Pakaian
        Kendaraan
        Antik
        Emas
        Kerajinan
        Properti
        Elektronik
    }

    type Query {
        allAuctions: [Auction!]!
        allUsers: [User!]!
        allTransactions: [Transaction!]
        getUser(id: ID!): User
        getAuction(id: ID!): Auction
        getAuctionsByFilter(text: String, category: [categor!]): [Auction!]
        currentUser: User
        getBids(auctionId: ID!): [Bid!]
    }

    type Mutation {
        createUser(name: String!, auth: AUTH!, phone: String, photo: String): AuthPayload!
        authenticateUser(username: String!, password: String!): AuthPayload!
        createAuction(title: String!, description: String!, category: categor!,initialprice: Int!, start: Date, end: Date, photos: [String!]): Auction!
        putBid(auctionId: ID!, amount: Int!): Bid
        updateBid(id: ID!, amount: Int!): Bid
        deleteBid(id: ID!): Boolean!
    }

    type Subscription {
        Bid(filter: BidSubscriptionFilter): BidSubscriptionPayload
    }

    input BidSubscriptionFilter {
        mutation_in: [_ModelMutationType!]
        auctionId: ID!
      }
      
    type BidSubscriptionPayload {
        mutation: _ModelMutationType!
        node: BidNode
    }

    type BidNode {
        id: ID!
        auctionId: ID!
        amount: Int!
        byId: ID!
        updated: Date!
        name: String!
        photo: String!
    }

    enum _ModelMutationType {
        CREATED
        UPDATED
        DELETED
    }
`;

module.exports = makeExecutableSchema({typeDefs: schema, resolvers});