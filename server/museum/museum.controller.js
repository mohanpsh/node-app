const request = require('request');
const moment = require('moment');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');

/**
 * Get visitors list. it return following properties
 * The month of the search
 * The year of the search
 * The total visitors for the month, not counting the ignored museum
 * The museum with the highest number of visitors, not counting the ignored museum
 * The museum with the lowest number of visitors, not counting the ignored museum
 * The ignored museum.
 * @property {number} req.query.date - A date in milliseconds.
 * @property {string} req.query.ignore - (Optional) museum to ignore.
 * @returns {*}
 */
function list(req, res, next) {
  return request({
    url: 'https://data.lacity.org/resource/trxm-jn3c.json',
    json: true
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      const err = new APIError('Unable to load Data', httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(err);
    }

    let total = 0;
    const highest = {
      museum: '',
      visitors: 0
    };
    const lowest = {
      museum: '',
      visitors: 0
    };
    const month = moment(req.query.date, 'x').format('MMM');
    const year = moment(req.query.date, 'x').format('YYYY');
    const ignore = req.query.ignore ? req.query.ignore : '';
    const ignored = {};
    body.forEach((museum) => {
      if (moment(museum.month).format('DD MMM YYYY') === moment(req.query.date, 'x').format('DD MMM YYYY')) {
        Object.keys(museum).forEach((key) => {
          if (key !== 'month' && key !== ignore) {
            total += parseInt(museum[key], 10);
            if (highest.museum === '' || highest.visitors < parseInt(museum[key], 10)) {
              highest.museum = key;
              highest.visitors = parseInt(museum[key], 10);
            }
            if (lowest.museum === '' || lowest.visitors > parseInt(museum[key], 10)) {
              lowest.museum = key;
              lowest.visitors = parseInt(museum[key], 10);
            }
          } else if (ignore && ignore === key) {
            ignored.museum = key;
            ignored.visitors = parseInt(museum[key], 10);
          }
        });
      }
    });
    const attendance = {
      month,
      year,
      highest,
      lowest,
      total
    };

    if (ignore) {
      attendance.ignored = ignored;
    }
    return res.json({ attendance });
  });
}

module.exports = { list };
