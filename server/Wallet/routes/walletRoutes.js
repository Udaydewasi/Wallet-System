const express = require('express');
const { getBalance, transferFunds } = require('../controllers/walletController');

const router = express.Router();

router.get('/balance/:userId', getBalance);
router.post('/transfer', transferFunds);

module.exports = router;