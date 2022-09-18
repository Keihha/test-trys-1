const Teams = require('../models/team');
const {to} = require('./../tools/to');

const bootstrapTeam = async (userId) => {
    
    return new Promise(async (resolve, reject) => {
        const dbTeam = new Teams({userId, team: []});
        await dbTeam.save();
        resolve();
    })
}

const addPokemon = (userId, pokemon = {}) => {
    return new Promise(async(resolve, reject) => {
        const [err, dbTeam] = await to(Teams.findOne({userId}).exec());
        if(err){
            return reject(err);
        }
        if(dbTeam.team.length === 6){
            return reject('Already have six(6) pokemons');
        } else {
            dbTeam.team.push(pokemon);
            await dbTeam.save();
            resolve();
        }

    });
}

const deletePokemon = (userId, pos) => {
    return new Promise (async (resolve, reject) => {
        const [err, dbTeam] = await to(Teams.findOne({userId}).exec());
        if(err){
            return reject(err);
        }
        if(dbTeam.team[pos]){
            dbTeam.team.splice(pos, 1);
        }
        await dbTeam.save();
        resolve();
    });
}

const getTeamOfUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        const [err, dbTeam] = await to(Teams.findOne({userId}).exec());
        if(err){
            return reject(err);
        }
        resolve(dbTeam.team || []);
    });
}

const setTeam = (userId, team) => {
    return new Promise (async (resolve, reject) => {
        const [err, dbTeam] = await to(Teams.findOne({userId}).exec());
        if(err){
            return reject(err);
        }
        dbTeam.team = team;
        await dbTeam.save();
        resolve();
    })
}

const cleanUpTeam = () => {

    return new Promise(async (resolve, reject) => {
        await Teams.deleteMany({}).exec();
        resolve();
    });;
    
}

module.exports = {bootstrapTeam, setTeam, getTeamOfUser, addPokemon, cleanUpTeam, deletePokemon};