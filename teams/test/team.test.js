 const chai = require('chai');
const chaiHttp = require('chai-http');
const {server} = require('../../app');
const { cleanUpTeam } = require('./../teams.controller');
const {registerUser,cleanUpUsers} = require('./../../auth/users.controller');
chai.use(chaiHttp);

beforeEach(async () => {
    await registerUser('rodrigo', '123456');
})

afterEach(async () => {
    await cleanUpUsers();
    await cleanUpTeam();
})


describe('suite de pruebas -/teams-', () => {
    
    it('should the team of the given user', (done) => {
        // cuaando la llamada no tiene correctamente la llave
        const team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Charmander'}];
        chai.request(server)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'rodrigo', password: '123456'})
            .end((err, res) => {                                    //RES es la respuesta recibida por el endpoint de la API
                const token = res.body.token;                       //como el login retorna un json en su body puede obtenerlo de ahi
                chai.assert.equal(res.statusCode, 200)
                chai.request(server)
                    .put('/teams/')
                    .send({team: team})
                    .set('Authorization', `JWT ${res.body.token}`)  //Aqui sigue tienendo alcance la RES
                    .end((err, res) => {
                        chai.request(server)
                            .get('/teams/')
                            .set('Authorization', `JWT ${token}`)   //Aca ya no tiene alcance, es necesario guardarlo en una var
                            .end((err, res) => {
                                // equipo con Charizard y Blastoise
                                // {trainer: 'rodrigo', team: [Pokemon]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'rodrigo');
                                chai.assert.equal(res.body.team.length, team.length);
                                chai.assert.equal(res.body.team[0].name, team[0].name);
                                chai.assert.equal(res.body.team[1].name, team[1].name);
                                chai.assert.equal(res.body.team[2].name, team[2].name);
                                done();
                            })
                    });
            });
    });

    it('should delete a pokemon (db[position])', (done) => {
        // cuaando la llamada no tiene correctamente la llave
        const team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Charmander'}];
        chai.request(server)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'rodrigo', password: '123456'})
            .end((err, res) => {                                    
                const token = res.body.token;                       
                chai.assert.equal(res.statusCode, 200)
                chai.request(server)
                    .put('/teams/')
                    .send({team: team})
                    .set('Authorization', `JWT ${res.body.token}`)
                    .end((err, res) => {
                        chai.request(server)
                            .get('/teams/')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // equipo con Charizard y Blastoise
                                // {trainer: 'rodrigo', team: [Pokemon]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'rodrigo');
                                chai.assert.equal(res.body.team.length, team.length);
                                chai.assert.equal(res.body.team[0].name, team[0].name);
                                chai.assert.equal(res.body.team[1].name, team[1].name);
                                chai.assert.equal(res.body.team[2].name, team[2].name);
                                chai.request(server)
                                    .delete('/teams/pokemon-team/del')
                                    .send({position: 2})
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {
                                        chai.assert.equal(res.statusCode, 200);
                                        chai.assert.equal(res.body.trainer, 'rodrigo');
                                        chai.assert.equal(res.body.team.length, team.length-1);
                                        chai.assert.equal(res.body.team[0].name, team[0].name);
                                        chai.assert.equal(res.body.team[1].name, team[1].name);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should return the pokedex number', (done) => {
        // cuaando la llamada no tiene correctamente la llave
        const pokemonName = 'Bulbasaur';
        chai.request(server)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'rodrigo', password: '123456'})
            .end((err, res) => {
                const token = res.body.token;
                chai.assert.equal(res.statusCode, 200)
                chai.request(server)
                    .post('/teams/pokemon-team')
                    .send({pokemonName})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(server)
                            .get('/teams/')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // equipo con Charizard y Blastoise
                                // {trainer: 'rodrigo', team: [Pokemon]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'rodrigo');
                                chai.assert.equal(res.body.team.length, 1);
                                chai.assert.equal(res.body.team[0].pokedexNumber, 1);
                                done();
                            })
                    });
            });
    });

    it('should not be able to add pokemon if you already have 6', (done) => {
        const team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Charmander'}, {name: 'Pikachu'}, {name: 'Pidgey'}, {name: 'Pidgeot'}];
        chai.request(server)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'rodrigo', password: '123456'})
            .end((err, res) => {
                const token = res.body.token;
                //Expect valid login
                chai.assert.equal(res.statusCode, 200);
                chai.request(server)
                    .put('/teams/')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(server)
                            .post('/teams/pokemon-team')
                            .send({pokemonName: 'Vibrava'})
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 400);
                                done();
                            });
                    });
            });
    });

});