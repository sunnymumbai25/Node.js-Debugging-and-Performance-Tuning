const Joi = require('joi');

const playerChoice = Joi.any().valid([
  'rock',
  'paper',
  'scissors',
]);

const id = Joi.number().integer().positive();

const Player = Joi.object({
  id: id.optional().allow(null),
  lastUpdated: Joi.date().required().raw(),
}).options({ abortEarly: false, stripUnknown: true });

module.exports = {
  id,
  Player,
  playerChoice,
};
