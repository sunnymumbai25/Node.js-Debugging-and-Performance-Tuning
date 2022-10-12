const chai = require('chai');
const Game = require('../../../../../servers/games/lib/Game');

const should = chai.should();

describe('servers/games/lib/Game.js', function () {
  context('determineOutcome', function () {
    it('should return a pending outcome for an empty game', function (done) {
      const game = new Game({});
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'pending',
        playerWinnerId: null,
      });
      done();
    });

    it('should return a pending outcome for a game missing a player1id', function (done) {
      const game = new Game({ player2id: 1 });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'pending',
        playerWinnerId: null,
      });
      done();
    });

    it('should return a pending outcome for a game missing a player2id', function (done) {
      const game = new Game({ player1id: 1 });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'pending',
        playerWinnerId: null,
      });
      done();
    });

    it('should return a pending outcome for a game missing a player1choice', function (done) {
      const game = new Game({ player1id: 1, player2id: 2, player2choice: 'scissors' });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'pending',
        playerWinnerId: null,
      });
      done();
    });

    it('should return a pending outcome for a game missing a player2choice', function (done) {
      const game = new Game({ player1id: 1, player2id: 2, player1choice: 'rock' });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'pending',
        playerWinnerId: null,
      });
      done();
    });

    it('should return a final outcome in favor of player1id if player1choice is rock and player2choice is scissors', function (done) {
      const game = new Game({
        player1id: 1, player2id: 2, player1choice: 'rock', player2choice: 'scissors',
      });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'final',
        playerWinnerId: 1,
      });
      done();
    });

    it('should return a final outcome in favor of player2id if player1choice is rock and player2choice is paper', function (done) {
      const game = new Game({
        player1id: 1, player2id: 2, player1choice: 'rock', player2choice: 'paper',
      });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'final',
        playerWinnerId: 2,
      });
      done();
    });

    it('should return a final tied outcome if both players choose the same thing', function (done) {
      const game = new Game({
        player1id: 1, player2id: 2, player1choice: 'rock', player2choice: 'rock',
      });
      const result = game.determineOutcome();
      result.should.deep.equal({
        state: 'final',
        playerWinnerId: null,
      });
      done();
    });
  });
});
