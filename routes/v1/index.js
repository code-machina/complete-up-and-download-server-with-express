const router = require('express').Router();

// 
const inventory = require('./inventory');

router.use('/inventory', inventory);

module.exports = router;