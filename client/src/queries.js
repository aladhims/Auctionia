import gql from 'graphql-tag';


export const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String!, $username: String!) {
    createUser(
      name: $name,
      auth: {
        email: $email,
        password: $password,
        username: $username,
      }
    ) {
      user {
          id
      }
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    authenticateUser(
        username: $username,
        password: $password
    ) {
      user {
          id
      }
      token
    }
  }
`;

export const BIDS_SUBS = gql`
subscription BidSubs($auctionId: ID!) {
  Bid(filter: {
    mutation_in: [CREATED,UPDATED,DELETED],
    auctionId: $auctionId
  }) {
    mutation
    node {
        id
        amount
        updated
        byId
        name
        photo
    }
  }
}
`;


export const AUCTION_DETAILS = gql`
query getAuctionsDetail($id: ID!) {
    getAuction(id: $id) {
        title
        description
        currentprice
        photos
        start
        end
        posted
        status
        category
        by {
            id
            name
            photo
        }
        bidders {
            id
            amount
            updated
            byId
            by {
                name
                photo
            }
        }
    }
}`;

export const CREATE_BID = gql`
    mutation createMyBid($auctionId: ID!, $amount: Int!) {
        putBid(auctionId: $auctionId, amount: $amount) {
            amount
            byId
            auctionId
            updated
        }
    }
`;

export const UPDATE_BID = gql`
    mutation updateMyBid($id: ID!, $amount: Int!){
        updateBid(id: $id, amount: $amount) {
            amount
            byId
            auctionId
            updated
        }
    }
`;

export const MY_AUCTIONS = gql`
    query myAuctions {
        currentUser {
            auctions {
              id
              title
              posted
              photos
              status
            }
            
            participations {
              id
              title
              posted
              photos
              status
            }
          }
    }
`;

export const ALL_AUCTIONS_QUERY = gql`
  query AllAuctionsQuery {
    allAuctions {
      id
      title
      description
      currentprice
      photos
      start
      posted
      winner {
        name
      }
      bidders {
        amount
      }
      category
      end
      status
      by {
        name
        photo
      }
    }
  }
`;

export const CREATE_AUCTION = gql`
    mutation buatLelang($title: String!, $description: String!, $category: categor!, $initialprice: Int!, $startTime: Date!,$endTime: Date, $photos: [String!]) {
        createAuction(title: $title, description: $description, category: $category, initialprice: $initialprice, start: $startTime, end: $endTime, photos: $photos ) {
            id
            title
            description
            currentprice
            photos
            start
            posted
            category
            end
            status
            bidders {
                amount
            }
            by {
                name
                photo
            }
        }
    }
`;

export const AUCTIONS_BY_FILTER = gql`
    query AuctionsFilter($search: String, $categories: [categor!]) {
      getAuctionsByFilter(text: $search, category: $categories){
        id
        title
        description
        currentprice
        photos
        start
        posted
        category
        end
        status
        winner {
          name
        }
        bidders {
          amount
        }
        by {
          name
          photo
        }
      }
    }
`;

