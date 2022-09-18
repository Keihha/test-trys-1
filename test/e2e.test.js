const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app').server;

chai.use(chaiHttp);

describe('Suite de prueba e2e', () => {
    it('should return hellow world', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                console.log('A');
                chai.assert.equal(res.text, 'hellow world');
                done();
            });
        console.log('B');
    });
});