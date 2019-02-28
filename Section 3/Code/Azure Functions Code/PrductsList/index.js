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

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
     var querySpec = {
        query: "SELECT * FROM root r"
        };

    var results = await client.database(databaseId).container(productsColl).items.readAll().toArray();
   
if(results.result.length>0)
    {
        context.res = {
             body: results.result
        };
    }
    else
    {
           context.res = {
        
            body: "No products found."
        };
    }
        context.done();


};