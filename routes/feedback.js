const express = require('express');

const router = express.Router();
const feedback = require('../models/feedback');

router.get('/', async(req, res, next) => {
    res.send('You are on home page');
})

router.get('/feedback', async(req, res, next) => {
    res.send('Fill in the Feedback Form details');
});


// post request using the form in the aboutus component
router.post('/aboutus', async(req, res, next) => {
    feedback.create(req.body).then((feed) => {
        res.send(feed);
    }).catch((err) => {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            res.send('All the fields are compulsory to fill in!')
        } else
            res.send('Error');
    })
});


// delete the feedback when you click the feedback
router.delete('/feedback/:id', async(req, res, next) => {
    feedback.findByIdAndDelete({ _id: req.params.id }).then((err, feed) => {
        res.send(feed);
    }).catch((err) => {
        res.send('Error');
    })
})

module.exports = router;