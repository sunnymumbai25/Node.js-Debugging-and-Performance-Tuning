module.exports = {
  database: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: '33306',
      user: 'root',
      database: 'rps',
    },
    migrations: {
      tableName: '_knex_migrations',
    },
  },
  players: {
    host: 'localhost',
    port: 5010,
    protocol: 'http',
  },
  games: {
    host: 'localhost',
    port: 5005,
    protocol: 'http',
  },
  server: {
    port: 5000,
  },
  session: {
    secret: 'darth jarjar',
  },
};
