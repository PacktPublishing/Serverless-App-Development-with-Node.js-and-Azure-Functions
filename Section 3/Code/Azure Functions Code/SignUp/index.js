const CosmosClient = require('@azure/cosmos').CosmosClient;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('./config');
const url = require('url');
const endpoint = config.endpoint;
const masterKey = config.primaryKey;
const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });
const HttpStatusCodes = { NOTFOUND: 404 };
const databaseId = config.database.id;
const productsColl=config.ProductCollection.id;
const usersColl=config.UserCollection.id;


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (req.params.account) {
         var result =JSON.parse(req.params.account)
         var hashedPassword = bcrypt.hashSync(result.password, 8);
         result.password=hashedPassword;
         await   client.database(databaseId).container(usersColl).items.create(result);
         
         context.res = {
             body: "Success"
        };
        context.done();
    }
    else {
        context.res = {
            status: 500,
            body: "Please send account parameter."
        };
    }
};