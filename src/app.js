require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const configs = require('./app/_helpers/config');
const routes = require('./app/routes');
const { startRedis } = require('./app/_helpers/dbFiles/redisConn');
const { seedSampleData } = require('./app/_helpers/seedScript');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//## Seed sample data
seedSampleData()

//## Routes
routes(app);

//## Starting Redis connection
startRedis();

/*-----Creating Express server----*/
const HOST = configs.serverHost;
const PORT = configs.serverPort;

/* Normalize a port into a number or false. */
function normalizePort(val) {
    let parsedPort = parseInt(val, 10);

    if (isNaN(parsedPort)) {
        return false;
    }

    if (parsedPort > 0) {
        return parsedPort;
    }

    return false;
}

const SERVER_PORT = normalizePort(PORT);
if (!SERVER_PORT) {
    throw new Error("Invalid 'Server Port' number");
}

app.listen(SERVER_PORT, HOST, () => console.log(`Server is running at http://${HOST}:${SERVER_PORT}`));
/*-------------------------------------------------*/