const express = require('express');
const { getTransactions } = require('../controllers/walletController');

const router = express.Router();

router.get('/:userId', getTransactions);

module.exports = router;
