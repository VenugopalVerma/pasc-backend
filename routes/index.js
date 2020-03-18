var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', (req, res) => {
    res.render('Login');
});
router.get('/api/google', function(req, res) {
    res.json(req.user);
});

module.exports = router;