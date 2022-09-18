const jwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt  = require('passport-jwt').ExtractJwt;
const passport    = require('passport');

const init = () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: 'secretPassword'
    }

    passport.use(new jwtStrategy(opts, (decoded, done) => {
        console.log('decoded jwt', decoded);
        return done(null, decoded);
    }));
}

const protectWithJwt = (req, res, next) => {
    console.log('++++++++++++++++++++++++++++++', req.path);
    if (req.path === '/' || req.path === '/auth/login') {
        return next();
    }
    return passport.authenticate('jwt', {session: false})(req, res, next);
}

exports.protectWithJwt = protectWithJwt;

module.exports = {
    init,
    protectWithJwt,
}