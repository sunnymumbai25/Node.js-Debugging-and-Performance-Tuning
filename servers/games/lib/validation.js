const Joi = require('joi');

const gameState = Joi.any().valid([
  'final',
  'pending',
]);

const playerChoice = Joi.any().valid([
  'rock',
  'paper',
  'scissors',
]);

const id = Joi.number().integer().positive();

const Game = Joi.object({
  id: id.optional().allow(null),
  lastUpdated: Joi.date().required().raw(),
  player1id: id.optional().allow(null),
  player1choice: playerChoice.optional().allow(null),
  player2id: id.optional().allow(null),
  player2choice: playerChoice.optional().allow(null),
  state: gameState.required(),
  playerWinnerId: id.optional().allow(null),
}).options({ abortEarly: false, stripUnknown: true });

module.exports = {
  Game,
  gameState,
  id,
  playerChoice,
};
