const express = require('express');
const router = express.Router();

const clientController = require('../controllers/ClientController');

router.post('/validatecode', clientController.validateCode);
router.post('/payment', clientController.payment);
router.post('/booking', clientController.booking);
router.post('/pre-booking', clientController.prebooking);
router.post('/choose_flight', clientController.choose_flight);
router.get('/', clientController.index);

module.exports = router;
