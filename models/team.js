const {Schema, model} = require('mongoose');

const TeamsSchema = Schema({ 
    userId: String,
    team: []
});

module.exports = model('Teams', TeamsSchema);