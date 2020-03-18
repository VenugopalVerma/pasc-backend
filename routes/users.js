var express = require('express');
var passport = require('passport');
// var GoogleAuth = require('../strategy/googleauth');
var user = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { isAuthenticated, isAdmin, handleRecaptcha } = require('../middleware/controller');
var TempUser = require('../models/tempuser');
var { verificationMail } = require('../config/config');
var crypto = require('crypto');


var router = express.Router();


//GOOGLE OAUTH  
router.get('/google', passport.authenticate('google', { scope: ['profile'] }), (req, res) => {
    res.json('Hey ther this ');
});

//GOOGLE REDIRECT LINK
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.json(req.user);
})


//LOGIN OUT THE USER WITH OAUTH 
router.get('/google/logout', (req, res) => {
    req.logout();
    res.redirect('/api/google');
});

// SIGNING UP USER
router.post('/signup', handleRecaptcha, (req, res) => {
    TempUser.findOne({ email: req.body.email })
        .then(async(newUser) => {
            if (newUser) {
                res.status(404).json({ error: 'User already exists', token: null });
            } else {
                var url;
                crypto.randomBytes(48, (err, buf) => {
                    if (err) console.log(err);
                    url = buf.toString('hex');
                    const hashedPassword = bcrypt.hashSync(req.body.password);
                    var newTempUser = new TempUser({
                        email: req.body.email,
                        password: hashedPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        admin: false,
                        URL: url
                    });
                    console.log('The User has been saved to the temporary storage');
                    const verifyurl = "http://" + req.hostname + ':3000/auth/verify/' + url;
                    verificationMail(newTempUser.email, verifyurl);
                    newTempUser.save();
                    res.json({ 'user': newTempUser, 'status': 'The user has been saved' });
                });
            }
        })
        .catch(err => console.log(err))
});


router.get('/verify/:url', (req, res) => {
    const url = req.params.url;
    TempUser.findOne({ URL: url })
        .then(tempuser => {
            if (!tempuser) {
                res.json('No Such User found')
            } else {
                //THIS USER NEEDS TO BE DELETED FROM TEMP USER AND 
                //STORED IN USER MODEL
                var verifiedUser = new user({
                    email: tempuser.email,
                    password: tempuser.password,
                    username: tempuser.username,
                    firstname: tempuser.firstname,
                    lastname: tempuser.lastname,
                    admin: false,
                });
                verifiedUser.save();
                console.log('User has been verified');
                res.json({ 'user': tempuser, 'status': 'Email has ben verified' });
                return TempUser.findByIdAndDelete(tempuser._id);
            }
        })

});


// FOR LOGGING THE USER INTO THE APP
router.post('/login', async(req, res) => {
    user.findOne({ email: req.body.email })
        .then(async(user) => {
            if (!user) {
                res.status(404).json({ error: 'User Does not exist', token: null });
            }
            const condition = (await bcrypt.compare(req.body.password, user.password));
            if (!condition) {
                res.status(404).json({ error: 'Password Incorrect', token: null });
            } else {
                var payload = { subject: user._id };
                var token = jwt.sign(payload, 'secret');
                res.json({ error: null, token: token, userd: { firstname: user.firstname, lastname: user.lastname, email: user.email, admin: user.admin } });
            }
        })
});


//FOR CHECKING WHETHER ADMIN OR NOT
router.get('/protected', isAuthenticated, (req, res) => {
    console.log('You are authenticated');
    console.log(req.payload);
    res.json({ 'Noice': 'abc', 'token': req.payload });
})



module.exports = router;