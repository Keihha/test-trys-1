const express = require('express');
const { registerUser } = require('./auth/users.controller');
const { dbConnect} = require('./database');
const server = express();
const port = 3001;

// Importaciones generales
const {setUpMiddleswares} = require('./middlewares/server-middleware');

// server middlewares
setUpMiddleswares(server);

// conectar DB (mongo)
const conectar = async () => {
    await dbConnect();
}
conectar();

registerUser('rodrigo', '123456');

server.get('/', [],(req, res) => {
    res.status(200).send('hellow world');
});

// ROUTES
server.use('/auth',     require('./auth/auth.routes'));
server.use('/teams',    require('./teams/teams.routes'));


server.listen(port, () => {
    console.log('server corriendo en port 3000')
});


module.exports = {server};