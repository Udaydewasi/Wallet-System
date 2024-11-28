const express = require('express');
const { creditFunds } = require('../controllers/Credit');
const {depositFunds} = require('../controllers/Deposit');
const {getBalance} = require('../controllers/getting');
const {createWallet} = require('../controllers/walletCreation');

const router = express.Router();

router.post('/deposit', depositFunds);
router.post('/credit', creditFunds);
router.get('/getbalance', getBalance);
router.post('/walletCreation', createWallet);

module.exports = router;
