const chai = require('chai');
const chaiHttp = require('chai-http');
const { cleanUpTeam } = require('../../teams/teams.controller');
const server = require('../../app').server;
const {registerUser, cleanUpUsers} = require('./../users.controller');

chai.use(chaiHttp);

beforeEach(async () => {
    await registerUser('rodrigo', '123456');
})

afterEach(async () => {
    await cleanUpUsers();
    await cleanUpTeam();
})

describe('Suite de pruebas auth', () => {
    it('should return 401 when no token available', (done) => {
        // llamada no tiene token
        chai.request(server)
            .get('/teams')
            .end((err,res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            })
    });
    it('should return 200 when jwt is valid', (done) => {
        chai.request(server)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'rodrigo', password: '123456'})
            .end((err,res) => {
                chai.assert.equal(res.statusCode, 200);
                chai.request(server)
                    .get('/teams/')
                    .set('Authorization', `JWT ${res.body.token}`)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        done();
                    });
            });
    });
});

after(async () => {
    await cleanUpUsers();
});