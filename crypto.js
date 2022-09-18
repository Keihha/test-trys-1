const bcryp = require('bcrypt');

// const hashPassword = (plainTextPwd, done) => {
    // bcryp.hash(plainTextPwd, 10, done);
// };

const hashPassword = (plainTextPwd) => {
    return new Promise((resolve, reject)=>{
        resolve(bcryp.hashSync(plainTextPwd, 10));
    })
};

const hashPasswordSync = (plainTextPwd) => {
    return bcryp.hashSync(plainTextPwd, 10);
};

const comparePassword = (password, dbPsw, done) => {
    bcryp.compare(password, dbPsw, done);
};

module.exports = {
    hashPassword,
    hashPasswordSync,
    comparePassword,
}