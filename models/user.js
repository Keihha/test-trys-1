const {Schema, model} = require('mongoose');

const UserSchema = Schema({ 
    userName: String, 
    password: String, 
    userId: String
});

module.exports = model('User', UserSchema);