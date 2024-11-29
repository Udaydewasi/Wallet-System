const express = require('express');
const { creditFunds } = require('../controllers/Credit');
const {depositFunds} = require('../controllers/Deposit');
const {getBalance, getHistory} = require('../controllers/getting');
const {createWallet} = require('../controllers/walletCreation');

const router = express.Router();

router.post('/deposit', depositFunds);
router.post('/credit', creditFunds);
router.get('/getbalance', getBalance);
router.get('/gethistory', getHistory);
router.post('/walletCreation', createWallet);

module.exports = router;
