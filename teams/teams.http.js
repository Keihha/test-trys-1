const axios = require('axios').default;
const { getUser } = require("../auth/users.controller");
const { getTeamOfUser, setTeam, deletePokemon, addPokemon } = require("./teams.controller");
const {to} = require('./../tools/to')

const getTeamFromUser = async (req, res) => {        
    const userDb = await getUser(req.user.userId);
    let team = await getTeamOfUser(req.user.userId);
    // console.log('++++++++++++++++++++++++++++++++++++++', team,'++++++++++++++++++++++++++++++++++++++');

    res.status(200).json({
        msg: 'ok',
        trainer: userDb.userName,
        team
    });
}

const setTeamToUser = async (req, res) => {
    await setTeam(req.user.userId, req.body.team);
    // console.log('++++++++++++++++++++++++++++++++++++++', req.user.userId,'++++++++++++++++++++++++++++++++++++++');
    res.status(200).send();
}

const addPokemonToTeam = async (req, res) => {
        
    const pokemonName = req.body.pokemonName.toLowerCase();

    const [pokeApiError, pokeApiResponse] = await to(axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`));
    
    const pokemon = {
        name: pokemonName,
        pokedexNumber: pokeApiResponse.data.id
    }

    if(pokeApiError){
        return res.status(400).json({message: pokeApiError});
    }

    try{
        await addPokemon(req.user.userId, pokemon);
        res.status(201).json(pokemon);
    }catch(err){
        return res.status(400).json({msg: 'you have already six pokemon', err});
    }
}

const deletePokemonToTeam = async (req, res) => {
    const pos = req.body.position;
    const id = req.user.userId;
    const userDb = await getUser(req.user.userId);
    await deletePokemon(id, pos);
    const team = await getTeamOfUser(id);

    res.status(200).json({
        trainer: userDb.userName,
        team
    });
}


module.exports = {
    getTeamFromUser,
    setTeamToUser,
    addPokemonToTeam,
    deletePokemonToTeam
}