const {Router} = require('express');
const router = Router();

const { getTeamFromUser, addPokemonToTeam, setTeamToUser, deletePokemonToTeam } = require('./teams.http');

router.get('/', getTeamFromUser);

router.put('/', setTeamToUser);

router.post('/pokemon-team', addPokemonToTeam);

router.delete('/pokemon-team/del', deletePokemonToTeam); 



module.exports = router;