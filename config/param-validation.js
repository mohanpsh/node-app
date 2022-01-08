const Joi = require('joi');

module.exports = {
  // get /api/visitors
  getVisitors: {
    query: {
      date: Joi.string().required()
    }
  }
};
