const debug = require('debug')('app:controller:WaitTimeDataManager');
const MongoDbController = require('./MongoDB');

function WaitTimeDataManager() {
    const { insertTime, getTime } = MongoDbController();

    /**
     * Take the current themepark time data, get the current date and insert the data into our DB.
     */
    function insertTimes(req, res) {
        const rides = req.body.rides;
        if (rides) {
            const collectionName = req.params.parkName;
            const date = new Date();

            parkData = {
                date: date.toISOString(),
                rides: JSON.parse(rides)
            };

            req.body.data = parkData;

            insertTime(req, res, collectionName).then((result) => res.json(result), (xhr) => res.status(500).json(xhr));
        }
    }

    /**
     * Get all the collected park time data from our DB
     */
    function getAllCollectedTimes(req, res) {
        const collectionName = req.params.parkName;
        getTime(req, res, collectionName).then((result) => res.json(result), (xhr) => res.status(500).json(xhr));
    }

    function getCollectionAverage(req, res) {
        const collectionName = req.params.parkName;
        getTime(req, res, collectionName).then((result) => {

        });
    }

    return {
        insertTimes,
        getAllCollectedTimes,
        getCollectionAverage
    }
}

module.exports = WaitTimeDataManager;


// data = [
//     {
//         park: 'UniversalStudiosFlorida',
//         dates: [
//             {
//                 1568986547694: [{"name":"Hogwarts™ Express - King's Cross Station","waitTime":30},{"name":"Despicable Me Minion Mayhem™","waitTime":20},{"name":"MEN IN BLACK™ Alien Attack™","waitTime":10},{"name":"Shrek 4-D","waitTime":10},{"name":"The Simpsons Ride™","waitTime":10},{"name":"E.T. Adventure™","waitTime":10},{"name":"Harry Potter and the Escape from Gringotts™","waitTime":10},{"name":"Race Through New York Starring Jimmy Fallon™","waitTime":5},{"name":"TRANSFORMERS™: The Ride-3D","waitTime":5},{"name":"Kang & Kodos' Twirl 'n' Hurl","waitTime":5},{"name":"Hollywood Rip Ride Rockit™","waitTime":5},{"name":"Revenge of the Mummy™","waitTime":5},{"name":"Stranger Things","waitTime":0},{"name":"Fievel's Playland™","waitTime":0},{"name":"Woody Woodpecker's Nuthouse Coaster™","waitTime":0},{"name":"Fast & Furious - Supercharged™","waitTime":0},{"name":"Yeti: Terror of the Yukon","waitTime":0},{"name":"Us","waitTime":0},{"name":"Universal Monsters","waitTime":0},{"name":"Curious George Goes to Town℠","waitTime":0},{"name":"Nightingales: Blood Pit","waitTime":0},{"name":"Killer Klowns From Outer Space","waitTime":0},{"name":"House of 1000 Corpses","waitTime":0},{"name":"Graveyard Games","waitTime":0},{"name":"Depths of Fear","waitTime":0},{"name":"Ghostbusters","waitTime":0}]
//             }
//         ]
//     }
// ]