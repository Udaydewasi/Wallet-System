const express = require('express');
const { credit } = require('../controllers/Credit');
const {deposit} = require('../controllers/Deposit');
const {getBalance} = require('../controllers/getting');

const router = express.Router();

router.post('/deposit', deposit);
router.post('/credit', credit);
router.get('/getbalance', getBalance);

module.exports = router;
