const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const {protectWithJwt, init} = require('./auth-middleware');

const setUpMiddleswares = (server) => {
    server.use(cors());
    server.use(express.json());
    server.use(bodyParser.json());
    init();
    server.use(protectWithJwt);
}



module.exports = {
    setUpMiddleswares
}