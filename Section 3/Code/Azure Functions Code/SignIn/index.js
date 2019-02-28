const CosmosClient = require('@azure/cosmos').CosmosClient;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('./config');
const url = require('url');
const endpoint = config.endpoint;
const masterKey = config.primaryKey;
const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });
const databaseId = config.database.id;
const productsColl=config.ProductCollection.id;
const usersColl=config.UserCollection.id;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.params.account) {
         var result =JSON.parse(req.params.account)
         var querySpec = {
        query: "SELECT * FROM root r WHERE r.email = @email and r.password=@password",
        parameters:
        [
            {
             name: "@email",
             value: String(result.email)
            },
             {
             name: "@password",
             value:  String(result.password)
            }
        ]
        };
        
    var results = await client.database(databaseId).container(usersColl).items.query(querySpec).toArray();

    
    if(results.result.length>0)
    {
         var token = jwt.sign({ id: results.result[0].id }, config.secret, {
         expiresIn: 120 // expires in 120 seconds
         });
         context.res.status(200).send({ auth: true, token: token,email:result.email });
    }
    else
    {
           context.res = {
            status: 401,
            body: "Unauthorized."
        };
    }
    }
    else
    {
           context.res = {
            status: 401,
            body: "Unauthorized."
        };
    }

        context.done();
};