const router = require('express').Router();

router.post('/register', (req, res) => {
   res.send('registered');
});

module.exports = router;