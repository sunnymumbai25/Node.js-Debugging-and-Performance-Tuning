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
  server: {
    port: 5005,
  },
};
