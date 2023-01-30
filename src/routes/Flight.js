const express = require('express');
const router = express.Router();

import FlightController from '../controllers/FlightController';

router.post('/get-all-flights', FlightController.GetInfoAllFlights);
router.post('/fullsearch', FlightController.fullSearch);
router.post('/filter', FlightController.filterFlight);
router.post('/get-flight', FlightController.getFlight);
router.post('/update', FlightController.updateChuyenBay);
router.post('/cancel', FlightController.CancelChuyenBay);

module.exports = router;
