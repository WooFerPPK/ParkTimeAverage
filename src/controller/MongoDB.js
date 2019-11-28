const debug = require('debug')('app:controller:MongoDB');
const { MongoClient, ObjectID } = require('mongodb');
const { DB_URL, DB_NAME } = require('../config/servers');

function MongoDB() {
    /*
     * Perform the DB insert command
     */
    function insertTime(req, res, collectionName) {
        return new Promise((resolve, reject) => {
            const options = {
                command: 'insert', 
                req, 
                res, 
                collectionName, 
                resolve, 
                reject
            }
            connectWithCommand(options);
        });
    }

    /*
     * Perform the DB get command
     */
    function getTime(req, res, collectionName) {
        return new Promise((resolve, reject)=>{ 
            const options = {
                command: 'get', 
                req, 
                res, 
                collectionName, 
                resolve, 
                reject
            }
            connectWithCommand(options);
        })
    }

    /*
     * Establish a connection and perform the command to the DB
     */
    function connectWithCommand(options) {
        try { 
            MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                options.client = client;
                connected(options);
            });
        } catch (error) {
            debug(error.stack);
            options.reject({ error: xhr.stack })
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
                options.resolve(response);
            },
            (xhr) => {
                debug(xhr);
                options.reject(xhr);
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
                options.reject(result);
            };
            options.resolve(result);
          });
    } 

    return {
        insertTime,
        getTime
    }
}

module.exports = MongoDB;