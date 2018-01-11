const dev = require('./dev');
const prod = require('./prod');

if(process.env.NODE_ENV === "production"){
    module.exports = prod;
}else {
    module.exports = dev;
}
