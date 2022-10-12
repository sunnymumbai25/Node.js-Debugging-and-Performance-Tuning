const config = require('../../../../servers/games/config');
const express = require('express');
const knex = require('knex')(config.database);
const mockKnex = require('mock-knex');
const request = require('supertest');
const proxyquire = require('proxyquire');
const chai = require('chai');
const Game = require('../../../../servers/games/lib/Game');

const should = chai.should();

describe('games API', function () {
  let tracker;
  let app;
  let override;

  before(function (done) {
    mockKnex.mock(knex);
    tracker = mockKnex.getTracker();

    override = { knex };
    override.knex['@global'] = true;

    done();
  });

  beforeEach(function (done) {
    app = express();
    app.use(express.json());

    const router = proxyquire('../../../../servers/games/router', override);

    app.use(router);
    tracker.install();
    done();
  });

  afterEach(function (done) {
    tracker.uninstall();
    done();
  });

  after(function (done) {
    mockKnex.unmock(knex);
    done();
  });

  context('/api/v1/rules', function () {
    context('GET', function () {
      it('should return an array of rules', function (done) {
        request(app)
          .get('/api/v1/rules')
          .expect('Content-Type', /json/)
          .expect(200, [
            'rock breaks scissors',
            'paper covers rock',
            'scissors cuts paper',
          ], done);
      });
    });
  });

  context('/api/v1/games', function () {
    context('GET', function () {
      it('should return all games', function (done) {
        const expected = [
          {
            id: 1,
            lastUpdated: '2018-03-17T20:33:36.000Z',
            player1choice: 'rock',
            player1id: 1,
            player2choice: 'scissors',
            player2id: 2,
            playerWinnerId: 1,
            state: 'final',
          },
        ];

        tracker.on('query', query => query.response(expected));

        request(app)
          .get('/api/v1/games')
          .expect('Content-Type', /json/)
          .expect(200, expected, done);
      });
    });

    context('POST', function () {
      it('should create a game', function (done) {
        const expected = {
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: null,
          player1id: null,
          player2choice: null,
          player2id: null,
          playerWinnerId: null,
          state: 'pending',
        };

        tracker.on('query', query => query.response([1]));

        request(app)
          .post('/api/v1/games')
          .send({ lastUpdated: '2018-03-17T20:33:36.000Z' })
          .expect('Content-Type', /json/)
          .expect(200, expected, done);
      });
    });
  });

  context('/api/v1/games/:game_id', function () {
    context('GET', function () {
      it('should return a game by id', function (done) {
        const expected = {
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: 'rock',
          player1id: 1,
          player2choice: 'scissors',
          player2id: 2,
          playerWinnerId: 1,
          state: 'final',
        };

        tracker.on('query', query => query.response([expected]));

        request(app)
          .get('/api/v1/games/1')
          .expect('Content-Type', /json/)
          .expect(200, expected, done);
      });
    });

    context('PATCH', function () {
      it('should update a game', function (done) {
        const existing = {
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: null,
          player1id: null,
          player2choice: null,
          player2id: null,
          playerWinnerId: null,
          state: 'pending',
        };

        const expected = new Game(existing);
        expected.player1id = 2;
        expected.lastUpdated = null;

        tracker.on('query', query => query.response([existing]));

        request(app)
          .patch('/api/v1/games/1')
          .send({ player1id: 2 })
          .expect('Content-Type', /json/)
          .expect((result) => {
            const resultGame = new Game(result.body);
            // Not dealing with fake timers.
            resultGame.lastUpdated = null;
            resultGame.should.deep.equal(expected);
          })
          .expect(200, done);
      });
    });
  });

  context('/api/v1/games/:game_id/judge', function () {
    context('POST', function () {
      it('should return a 304 for an incomplete game', function (done) {
        tracker.on('query', query => query.response([{
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: 'rock',
          player1id: 1,
          player2choice: null,
          player2id: 2,
          playerWinnerId: null,
          state: 'pending',
        }]));

        request(app)
          .post('/api/v1/games/1/judge')
          .expect(304, '', done);
      });

      it('should determine the outcome and update a game that is ready to be judged', function (done) {
        tracker.on('query', query => query.response([{
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: 'rock',
          player1id: 1,
          player2choice: 'paper',
          player2id: 2,
          playerWinnerId: null,
          state: 'pending',
        }]));

        request(app)
          .post('/api/v1/games/1/judge')
          .expect('Content-Type', /json/)
          .expect((result) => {
            const resultGame = new Game(result.body);
            // Not dealing with fake timers.
            resultGame.lastUpdated = null;
            resultGame.should.deep.equal({
              id: 1,
              lastUpdated: null,
              player1choice: 'rock',
              player1id: 1,
              player2choice: 'paper',
              player2id: 2,
              playerWinnerId: 2,
              state: 'final',
            });
          })
          .expect(200, done);
      });
    });
  });
});
