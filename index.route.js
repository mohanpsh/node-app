const express = require('express');
const museumRoutes = require('./server/museum/museum.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount visitors routes at /visitors
router.use('/visitors', museumRoutes);

module.exports = router;
