const assert = require('chai').assert;

const addValue = (a, b) => {
    return a+b;
}

describe('Suite de prueba', () => {
    it('should return 4', () => {
        // llama a la funcion
        let vari = addValue(2, 2);
        // variable con el ressultado y a la derecha lo esperado
        // dos variables: resultado y esperado (en orden)
        assert.equal(vari, 4);
    });
});