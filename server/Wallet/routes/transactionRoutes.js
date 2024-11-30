const express = require('express');
<<<<<<< HEAD
const { debitFunds } = require('../controllers/Debit');
=======
const { creditFunds } = require('../controllers/Credit');
>>>>>>> fdd81fa7263ed06ce11d313518939018f3edbb95
const {depositFunds} = require('../controllers/Deposit');
const {getBalance, getHistory} = require('../controllers/getting');
const {createWallet} = require('../controllers/walletCreation');
const {verifyToken} = require('../middlewares/verifyToken');
<<<<<<< HEAD
const {transferFunds} = require('../controllers/transferFund');
=======
>>>>>>> fdd81fa7263ed06ce11d313518939018f3edbb95

const router = express.Router();

router.post('/deposit', depositFunds);
<<<<<<< HEAD
router.post('/credit', debitFunds);
router.post('/transfer', transferFunds);
router.get('/getbalance', getBalance);
router.get('/gethistory', verifyToken, getHistory);
router.post('/walletCreation', verifyToken, createWallet);
 
=======
router.post('/credit', creditFunds);
router.get('/getbalance', getBalance);
router.get('/gethistory', verifyToken, getHistory);
router.post('/walletCreation', verifyToken, createWallet);

>>>>>>> fdd81fa7263ed06ce11d313518939018f3edbb95
module.exports = router;
