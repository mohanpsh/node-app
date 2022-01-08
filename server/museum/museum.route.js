const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const museumCtrl = require('./museum.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/visitors - Get list of visitors */
  .get(validate(paramValidation.getVisitors), museumCtrl.list);

module.exports = router;
