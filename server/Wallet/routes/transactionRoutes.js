const express = require('express');
const { creditFunds } = require('../controllers/Credit');
const {depositFunds} = require('../controllers/Deposit');
const {getBalance, getHistory} = require('../controllers/getting');
const {createWallet} = require('../controllers/walletCreation');
const {verifyToken} = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/deposit', verifyToken, depositFunds);
router.post('/credit', verifyToken, creditFunds);
router.get('/getbalance', verifyToken, getBalance);
router.get('/gethistory', verifyToken, getHistory);
router.post('/walletCreation', verifyToken, createWallet);

module.exports = router;
