const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const assert = require('assert');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

describe('## Visitors APIs', () => {
  const input = {
    date: '1404198000000',
    ignore: 'avila_adobe'
  };

  describe('# GET /api/visitors', () => {
    it('should get Jul 2014 visitors with ignore param', (done) => {
      request(app)
        .get('/api/visitors')
        .query({ date: input.date, ignore: input.ignore })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.attendance.month).to.equal('Jul');
          expect(res.body.attendance.year).to.equal('2014');
          expect(res.body.attendance.total).to.equal(28157);
          done();
        })
        .catch(done);
    }).timeout(10000);

    it('should get with ignore param and ignore data in output ', (done) => {
      request(app)
        .get('/api/visitors')
        .query({ date: input.date, ignore: input.ignore })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.attendance.ignored.museum).to.equal(input.ignore);
          done();
        })
        .catch(done);
    }).timeout(10000);

    it('should get Jul 2014 visitors without ignore param', (done) => {
      request(app)
        .get('/api/visitors')
        .query({ date: input.date })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.attendance.month).to.equal('Jul');
          expect(res.body.attendance.year).to.equal('2014');
          expect(res.body.attendance.total).to.equal(60535);
          done();
        })
        .catch(done);
    }).timeout(10000);

    it('should get visitors without date param', (done) => {
      request(app)
        .get('/api/visitors')
        .then((res) => {
          assert.equal(res.status, 400);
          done();
        })
        .catch(done);
    }).timeout(10000);
  });
});
