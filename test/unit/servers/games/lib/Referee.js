const chai = require('chai');

const Referee = require('../../../../../servers/games/lib/Referee');

const referee = new Referee();

const should = chai.should();

describe('servers/games/lib/Referee.js', function () {
  context('judge', function () {
    it('should result null if both choices are the same', function (done) {
      const result = referee.judge('rock', 'rock');
      should.not.exist(result);
      done();
    });

    it('should return true if the first choice is rock and the second choice is scissors', function (done) {
      const result = referee.judge('rock', 'scissors');
      result.should.equal(true);
      done();
    });

    it('should return false if the first choice is scissors and the second choice is rock', function (done) {
      const result = referee.judge('scissors', 'rock');
      result.should.equal(false);
      done();
    });
  });

  context('rules', function () {
    it('should render rules as an array of X beats Y', function (done) {
      const result = referee.rules();
      result.should.deep.equal([
        'rock breaks scissors',
        'paper covers rock',
        'scissors cuts paper',
      ]);
      done();
    });
  });
});
