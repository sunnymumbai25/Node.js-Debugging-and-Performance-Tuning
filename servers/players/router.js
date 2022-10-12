const express = require('express');
const Player = require('./lib/Player');
const players = require('./lib/players');

const router = new express.Router();

router.route('/api/v1/players')
  .post(async (request, response) => {
    const player = new Player(request.body);
    const result = await players.create(player);
    return response.json(result);
  });

router.param('player_id', async (request, response, next, id) => {
  request.player = await players.get(id);
  return next();
});

router.route('/api/v1/players/:player_id')
  .get((request, response) => response.json(request.player));

module.exports = router;
