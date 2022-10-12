module.exports.up = knex => knex.schema.hasTable('games').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('games', (table) => {
      table.increments('id').unsigned().primary();
      table.dateTime('lastUpdated').notNull();
      table.integer('player1id').unsigned();
      table.enum('player1choice', ['rock', 'paper', 'scissors']);
      table.integer('player2id').unsigned();
      table.enum('player2choice', ['rock', 'paper', 'scissors']);
      table.enum('state', ['pending', 'final']).notNull();
      table.integer('playerWinnerId').unsigned();

      table.engine('InnoDB');
      table.charset('utf8');
    });
  }
  return true;
});

module.exports.down = () => {};
