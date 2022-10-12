const forEach = require('lodash/forEach');

module.exports = class {
  constructor() {
    this.training = {};

    this.train('rock', 'scissors', 'breaks');
    this.train('paper', 'rock', 'covers');
    this.train('scissors', 'paper', 'cuts');
  }

  judge(choice1, choice2) {
    if (choice1 === choice2) {
      return null;
    }

    return typeof this.training[choice1][choice2] !== 'undefined';
  }

  train(winner, loser, verb) {
    this.training[winner] = {};
    this.training[winner][loser] = verb;
  }

  rules() {
    const rules = [];

    forEach(this.training, (rule, winner) => {
      forEach(rule, (verb, loser) => {
        rules.push(`${winner} ${verb} ${loser}`);
      });
    });

    return rules;
  }
};
