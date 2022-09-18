const {v4: uuidv4} = require('uuid');
const {hashPassword, comparePassword, hashPasswordSync} = require('../crypto');
const User = require('../models/user');
const {bootstrapTeam} = require('./../teams/teams.controller')
const {to} = require('./../tools/to');

let userDatabase = {};
// userID -> password(crypt)

const registerUser = async (userName, userPwd) => {
    
    return new Promise(async (resolve, reject) => {
        const userId = uuidv4();
        const pswCrypt = await hashPassword(userPwd);
        
        const newUser = new User({userName, password: pswCrypt, userId});
        
        await newUser.save();
        await bootstrapTeam(userId);
        // console.log('++++++++++++++++++++++++++++++++++++++', 'CREATED','++++++++++++++++++++++++++++++++++++++');
        resolve();
    });
}

const getUser = (userId) => {
    return new Promise( async (resolve, reject) => {
        const [err, result] = await to(User.findOne({userId}).exec());
        if(err){
            return reject('no user found');
        }
        resolve(result);
    });
}

const getUserFromName = (userName) => {
    
    return new Promise(async (resolve, reject)=>{
        const [err, result] = await to(User.findOne({userName}).exec());
        if(err){
            return reject('no user found');
        }
        resolve(result);
    });
    
}

const cleanUpUsers = async () => {
    return new Promise(async (resolve, reject)=>{
        await User.deleteMany({}).exec();
        resolve();
    });
}

const checkUserCredentials = (userName, userPwd) => {
    
    return new Promise(async(resolve, reject) => {
        const user = await getUserFromName(userName);
        if(user){
            comparePassword(userPwd, user.password, (err, result) => {
                if(err){
                    return reject(err);
                }else {
                    resolve(result);
                }
            });
            return;
        } else {
            reject('Missing user');
        }
    });
}

module.exports = {
    registerUser,
    checkUserCredentials,
    getUserFromName,
    getUser,
    cleanUpUsers
}
