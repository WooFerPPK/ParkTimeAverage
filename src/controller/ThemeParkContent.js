const Themeparks = require('themeparks');
const debug = require('debug')('app:controller:ThemeParkContent');

const parks = [];

function ThemeParkContent() {
    function getPark(parkName) {
        // We want to check if a park is already cached 
        if (parks[parkName] === undefined) {
            try {
                parks[parkName] = new Themeparks.Parks[parkName]();
            } catch (error) {
                debug(error);
            }
        }

        return parks[parkName];
    }

    function sortByLongestTimes(rides) {
        return rides.sort((a, b) => {
            return b.waitTime - a.waitTime
        });
    }

    function showOnlyNamesAndTimes(rides) {
        const reducedRideList = [];

        for (let i = 0; i < rides.length; i++) {
            const ride = rides[i];
            reducedRideList.push({
                name: ride.name,
                waitTime: ride.waitTime
            })
        }

        return reducedRideList;
    }

    function modifiedWaitTimes(options) {
        const { parkName } = options.req.params;
        const themepark = getPark(parkName);
        
        if (themepark) {
            themepark.GetWaitTimes().then(
                (response) => {
                    let rides = sortByLongestTimes(response);
                    rides = showOnlyNamesAndTimes(rides);
                    (options.resolve) ? options.resolve(rides) : options.res.json(rides);
                },
                (xhr) => {
                    debug(xhr.stack);
                    (options.reject) ? options.reject({ error: xhr.stack }) : options.res.status(500).json({ error: xhr.stack });
                    
                });
        } else {
            debug('No themepark found');
            (options.reject) ? options.reject({ error: 'No themepark found' }) : options.res.status(404).json({ error: 'No themepark found' });
        }
    }

    function getModifiedWaitTimes(req, res) {
        modifiedWaitTimes({
            req,
            res
        });
    }

    function returnModifiedWaitTimes(req, res) {
        // Park was found
        return new Promise((resolve, reject) => {
            modifiedWaitTimes({
                resolve,
                reject,
                req
            });
        });
    }

    return {
        getModifiedWaitTimes,
        returnModifiedWaitTimes
    }
}

module.exports = ThemeParkContent;