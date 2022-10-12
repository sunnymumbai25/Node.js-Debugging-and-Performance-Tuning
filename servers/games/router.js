const express = require('express');
const games = require('./lib/games');
const Game = require('./lib/Game');
const Referee = require('./lib/Referee');

const referee = new Referee();

const router = new express.Router();

router.route('/api/v1/games')
  .get(async (request, response) => {
    const game = await games.fetch(request.query);
    return response.json(game);
  })
  .post(async (request, response) => {
    const game = await games.create(new Game(request.body));
    return response.json(game);
  });

router.param('game_id', async (request, response, next, id) => {
  request.game = await games.get(id);
  next();
});

router.route('/api/v1/games/:game_id')
  .get((request, response) => response.json(request.game))
  .patch(async (request, response) => {
    const result = await games.update(request.game, request.body);
    return response.json(result);
  });

router.route('/api/v1/games/:game_id/judge')
  .post(async (request, response) => {
    const outcome = request.game.determineOutcome();

    if (outcome.state !== 'final') {
      return response.status(304).send();
    }

    const result = await games.update(request.game, outcome);
    return response.json(result);
  });

router.route('/api/v1/rules')
  .get((request, response) => response.json(referee.rules()));

module.exports = router;
