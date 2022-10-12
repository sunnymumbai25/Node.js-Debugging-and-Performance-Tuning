const chai = require('chai');

const config = require('../../../../../servers/games/config');
const knex = require('knex')(config.database);
const mockKnex = require('mock-knex');
const proxyquire = require('proxyquire');
const Game = require('../../../../../servers/games/lib/Game');

const should = chai.should();

describe('servers/games/lib/games.js', function () {
  let tracker;
  let games;

  const validGame = {
    id: 1234,
    lastUpdated: new Date('2015-02-03 16:45:00'),
    player1id: 2,
    player1choice: 'rock',
    player2id: 3,
    player2choice: 'paper',
    state: 'final',
    playerWinnerId: 2,
  };

  before(function (done) {
    mockKnex.mock(knex);
    tracker = mockKnex.getTracker();

    games = proxyquire('../../../../../servers/games/lib/games', {
      knex: () => knex,
    });

    done();
  });

  beforeEach(function (done) {
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

  context('fetch', function () {
    it('should fetch all records', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([]);
      });

      return games.fetch({})
        .then((result) => {
          bindings.length.should.equal(0);
          return result;
        });
    });

    it('should fetch records by state', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([]);
      });

      return games.fetch({ state: 'final' })
        .then((result) => {
          bindings.length.should.equal(1);
          bindings[0].should.equal('final');
          return result;
        });
    });

    it('should fetch records and limit', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([]);
      });

      return games.fetch({ limit: 1 })
        .then((result) => {
          bindings.length.should.equal(1);
          bindings[0].should.equal(1);
          return result;
        });
    });

    it('should fetch records and order in a direction', function () {
      let bindings;
      let sql;

      tracker.on('query', (query) => {
        ({ bindings, sql } = query);
        query.response([]);
      });

      return games.fetch({ order: 'DESC' })
        .then((result) => {
          bindings.length.should.equal(0);
          sql.should.contain('order by `id` DESC');
          return result;
        });
    });
  });


  context('create', function () {
    it('should create a record', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([1234]);
      });

      return games.create(validGame)
        .then((result) => {
          const expected = new Game(validGame);
          expected.id = 1234;
          bindings.length.should.equal(8);
          bindings[0].should.equal(1234);
          result.should.deep.equal(expected);
          return result;
        });
    });
  });

  context('get', function () {
    it('should get a record', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([validGame]);
      });

      return games.get(1234)
        .then((result) => {
          bindings.length.should.equal(1);
          bindings[0].should.equal(1234);
          result.should.deep.equal(validGame);
          return result;
        });
    });

    it('should return null if there are no records', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([]);
      });

      return games.get(1234)
        .then((result) => {
          bindings.length.should.equal(1);
          bindings[0].should.equal(1234);
          should.not.exist(result);
          return result;
        });
    });
  });

  context('update', function () {
    it('should update a record', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([]);
      });

      return games.update(validGame, { player2choice: null, state: 'pending' })
        .then((result) => {
          const expected = new Game(validGame);
          expected.player2choice = null;
          expected.state = 'pending';

          bindings.length.should.equal(9);
          result.should.deep.equal(expected);
          return result;
        });
    });
  });
});
