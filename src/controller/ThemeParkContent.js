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

    function getModifiedWaitTimes(req, res) {
        const { parkName } = req.params;
        const themepark = getPark(parkName);

        // Park was found
        if (themepark) {
            themepark.GetWaitTimes().then(
                (response) => {
                    let rides = sortByLongestTimes(response);
                    rides = showOnlyNamesAndTimes(rides);
                    res.json(rides);
                },
                (xhr) => {
                    debug(xhr.stack);
                    res.status(500).json({ error: xhr.stack });
                });
        } else {
            debug('No themepark found')
            res.status(404).json({ error: 'No themepark found' });
        }
    }

    return {
        getModifiedWaitTimes
    }
}

module.exports = ThemeParkContent;