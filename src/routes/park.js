const express = require('express');
const debug = require('debug')('app:routes:park');
const ThemeParkContentController = require('../controller/ThemeParkContent');
const WaitTimeDataManagerController = require('../controller/WaitTimeDataManager');

const park = express.Router();

function router() {
    const { getModifiedWaitTimes } = ThemeParkContentController();
    const { insertTimes } = WaitTimeDataManagerController();
    /**
     * Get the park ride time list from the Themepark api.
     */
    park.route('/:parkName').get(getModifiedWaitTimes);

    /**
     * Insert into a seperate DB the times and the date inserted. Used for the average times.
     */
    park.route('/:parkName').put(insertTimes);
    return park;
}

module.exports = router;