const router = require('express').Router();
const Filter = require('../models/FIlter');

router.get('/', async (req, res) => {
    try {
        const filters = await Filter.find();
        res.json(filters);
    } catch(err) {
        res.json({message: err});
    }
});

router.post('/', async (req, res) => {
    const filter = new Filter({
        id: req.body.id,
        name: req.body.name,
        className: req.body.className
    });
    try {
        const savedFilter = await filter.save();
        res.json(savedFilter);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;