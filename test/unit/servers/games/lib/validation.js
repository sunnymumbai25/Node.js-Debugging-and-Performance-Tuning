const chai = require('chai');
const validation = require('../../../../../servers/games/lib/validation');

const should = chai.should();

describe('servers/games/lib/validation.js', function () {
  context('Game', function () {
    it('should accept valid input', function (done) {
      const input = {
        lastUpdated: new Date(),
        state: 'pending',
      };
      const result = validation.Game.validate(input);

      result.value.should.deep.equal(input);
      should.not.exist(result.error);

      done();
    });

    it('should reject a string', function (done) {
      const result = validation.Game.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.include('"value" must be an object');

      done();
    });

    it('should reject invalid input', function (done) {
      const result = validation.Game.validate({});

      result.error.should.be.an('error');
      result.error.message.should.include('child "lastUpdated" fails because');

      done();
    });
  });

  context('gameState', function () {
    it('should accept valid input', function (done) {
      const result = validation.gameState.validate('final');

      result.value.should.equal('final');
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = validation.gameState.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.include('"value" must be one of');

      done();
    });
  });

  context('id', function () {
    it('should accept valid input', function (done) {
      const result = validation.id.validate(1);

      result.value.should.equal(1);
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = validation.id.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.equal('"value" must be a number');

      done();
    });
  });


  context('playerChoice', function () {
    it('should accept valid input', function (done) {
      const result = validation.playerChoice.validate('rock');

      result.value.should.equal('rock');
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = validation.playerChoice.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.include('"value" must be one of');

      done();
    });
  });
});
