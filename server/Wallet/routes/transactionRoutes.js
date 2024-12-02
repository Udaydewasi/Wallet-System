const express = require('express');
const { debitFunds } = require('../controllers/Debit');
const {depositFunds} = require('../controllers/Deposit');
const {getBalance, getHistory} = require('../controllers/getting');
const {createWallet} = require('../controllers/walletCreation');
const {verifyToken} = require('../middlewares/verifyToken');
const {transferFunds} = require('../controllers/transferFund');

const router = express.Router();

router.post('/deposit', verifyToken, depositFunds);
router.post('/debit', verifyToken, debitFunds);
router.post('/transfer', verifyToken, transferFunds);
router.get('/getbalance', verifyToken, getBalance);
router.get('/gethistory', verifyToken, getHistory);
router.post('/walletcreation', createWallet);
 
module.exports = router;
