const express = require('express');
const { debitFunds } = require('../controllers/Debit');
const {depositFunds} = require('../controllers/Deposit');
const {getBalance, getHistory} = require('../controllers/getting');
const {createWallet} = require('../controllers/walletCreation');
const {verifyToken} = require('../middlewares/verifyToken');
const {transferFunds} = require('../controllers/transferFund');

const router = express.Router();

router.post('/deposit', depositFunds);
router.post('/credit', debitFunds);
router.post('/transfer', transferFunds);
router.get('/getbalance', getBalance);
router.get('/gethistory', verifyToken, getHistory);
router.post('/walletCreation', verifyToken, createWallet);

module.exports = router;
