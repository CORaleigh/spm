const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb://stormwater:w7bUb4FTfGfTwANPP5q2EVOm5yqpNDLwMWpNKbwbX6c60xDJ0jd2ylYxwQNZJA3ajhaLbIHsHDzSJCOG2Bktqw%3D%3D@stormwater.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@stormwater@";
const DATABASE_NAME = "stormwater";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("forminput");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
    
    app.post("/forminput", (request, response) => {
        collection.insert(request.body, (error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result.result);
        });
    });

    app.get("/forminput", (request, response) => {
        collection.find({}).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });

    app.get("/forminput/:id", (request, response) => {
        collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });

});