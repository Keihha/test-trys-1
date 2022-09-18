const mongoose = require('mongoose');
require('dotenv').config();

let dbName = '';
const dbLink = process.env.DATABASE;

if(process.env.NODE_ENV === 'test'){
    dbName = 'test';
} else {
    dbName = 'dboffi'
}

const dbUrl = `${dbLink}${dbName}`;

const dbConnect = async () => {
    try{
        mongoose.connect(dbUrl);
        console.log('base de datos online');
    }catch(error){
        console.log(error);
        throw new Error('error a la hora de inicar el proceso en DB');
    }
}

module.exports = {
    dbConnect,
}