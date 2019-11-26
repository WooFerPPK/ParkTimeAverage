const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const parkRouter = require('./src/routes/park')();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Dist Folder
app.use(express.static(path.join(__dirname, '/dist')));

// Index file where webpack is loaded
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

// Park time API route.
app.use('/park', parkRouter);

app.listen(port, () => {
    debug(`Listening on port ${port}`);
});