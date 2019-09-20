const debug = require('debug')('app:controller:MongoDB');
const { MongoClient, ObjectID } = require('mongodb');
const { DB_URL, DB_NAME } = require('../config/servers');

function MongoDB() {

    function insertData(options) {
        options.col.insertOne(options.req.body.data).then(
            (response) => {
                options.res.json(response);
            },
            (xhr) => {
                debug(xhr);
                res.status(500).json(xhr);
            }
        );
    }

    function connected(options) {
        debug(`MongoDB connected to ${DB_URL}`);
        const db = options.client.db(DB_NAME);
        options.col = db.collection(options.collectionName);

        switch (options.command) {
            case 'insert':
                insertData(options);
                break;

            default:
                break;
        }
        options.client.close();
    }

    function insert(req, res, collectionName) {
        try {
            MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                connected({
                    req,
                    res,
                    client,
                    collectionName,
                    command: 'insert'
                })
            });
        } catch (error) {
            debug(error.stack);
            res.status(500).json({ error: xhr.stack });
        }
    }

    return {
        insert
    }
}

module.exports = MongoDB;