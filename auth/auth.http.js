const jwt = require('jsonwebtoken');
const { checkUserCredentials, getUserFromName } = require("./users.controller");

const SECRETORPRIVATEKEY = "secretPassword";


const userLogin = async(req, res) => {

    if(!req.body){
        return res.status(400).json({message: 'Missing Data PRIME'});
    } else if (!req.body.user || !req.body.password){
        return res.status(400).json({message: 'Missing Data SECOND'});
    }
    
    const checked = await checkUserCredentials(req.body.user, req.body.password);
    
    let user = await getUserFromName(req.body.user);
    
    if(!checked){
        return res.status(401).json({msg: 'invalid credentials'});
    }

    // SETED TOKEN
    const token = jwt.sign({userId: user.userId}, SECRETORPRIVATEKEY);
    res.status(200).json({token: token});
}

module.exports = {
    userLogin
}