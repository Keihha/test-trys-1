const {Router} = require('express');
const router = Router();
const { userLogin } = require('./auth.http');

router.post('/login', userLogin);

module.exports = router;