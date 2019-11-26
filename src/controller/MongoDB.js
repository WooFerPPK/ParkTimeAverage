const debug = require('debug')('app:controller:MongoDB');
const { MongoClient, ObjectID } = require('mongodb');
const { DB_URL, DB_NAME } = require('../config/servers');

function MongoDB() {
    /*
     * Perform the DB insert command
     */
    function insert(req, res, collectionName) {
        connectWithCommand('insert', req, res, collectionName);
    }

    /*
     * Perform the DB get command
     */
    function get(req, res, collectionName) {
        connectWithCommand('get', req, res, collectionName);
    }

    /*
     * Establish a connection and perform the command to the DB
     */
    function connectWithCommand(command, req, res, collectionName) {
        try {
            MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                connected({
                    req,
                    res,
                    client,
                    collectionName,
                    command
                })
            });
        } catch (error) {
            debug(error.stack);
            res.status(500).json({ error: xhr.stack });
        }
    }

    /*
     * Connect to the specified DB and open the collection requested. Then perform the command on the collection table.
     */
    function connected(options) {
        debug(`MongoDB connected to ${DB_URL}`);
        const db = options.client.db(DB_NAME);
        options.col = db.collection(options.collectionName);

        switch (options.command) {
            case 'insert':
                insertData(options);
                break;
            case 'get':
                getData(options);
                break;
            default:
                break;
        }

        options.client.close();
    }

    /*
     * Insert the given data into the DB and return the response.
     */
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

    /*
     * Get all the collected park time data
     */
    function getData(options) {
        options.col.find({}).toArray((error, result) => {
            if (error) {
                debug(error);
                res.status(500).json(error);
            };
            options.res.json(result);
          });
    } 

    return {
        insert,
        get
    }
}

module.exports = MongoDB;