
const express = require('express');
const bodyParser = require('body-parser');
const {graphiqlExpress, graphqlExpress} = require('apollo-server-express');
const {execute, subscribe} = require('graphql');
const {createServer} = require('http');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const mongoose =  require('mongoose');
const User = require('./database/User');
const Auction = require('./database/Auction');
const Transaction = require('./database/Transaction');
const Bid = require('./database/Bid');
const dataloaders = require('./utils/dataloaders');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

const loaders = dataloaders({
    User,
    Auction,
    Transaction,
    Bid
});
const schema = require('./schema/index');

const PORT = process.env.PORT || 8070;
const app = express();


mongoose.connect(config.MONGO_URI);


const authenticate = async ({headers: {authorization}}) => {
    const bearerLength = "Bearer ".length;
    if(authorization && authorization.length > bearerLength){
        //check authentication
        const token = authorization.slice(bearerLength);
        const decoded = jwt.verify(token, config.JWT_KEY);
        return await User.findById(decoded.id);
    }

    return null;
    
}
const buildOptions = async (req,res) => { 
    const user = await authenticate(req);
    return {
        context: {User,Auction,Transaction,Bid, loaders, user},
        schema
    }
    
}


if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'));

    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    })
}else {
    mongoose.set('debug',true);
    var corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true
    };
    app.use(cors(corsOptions));
}

app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

//below is the graphql playground endpoint
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhNDUxNTkzNWQ2MDQzMjUwMDM2NTUxMyIsImlhdCI6MTUxNTU4ODQzMSwiZXhwIjoxNTE2MTkzMjMxfQ.kMDR0Tx31vxgcunL-J5nVGzCIs8KCop5LT1Cew1DtP8'`,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));



const server = createServer(app);
server.listen(PORT, () => {
    SubscriptionServer.create(
        {execute, subscribe, schema},
        {server, path: '/subscriptions'},
    );
    console.log(`graphiql is listening to http://localhost:${PORT}/graphiql`);
})