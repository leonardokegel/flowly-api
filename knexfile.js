require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
//   config = {
//     client: "pg",
//     connection: {
//       connectionString: process.env.DATABASE_URL,
//     },
//   };
module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DEV_ENV_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      // host: process.env.DEV_ENV_HOST,
      // port: process.env.DEV_ENV_PORT,
      // user: process.env.DEV_ENV_USERNAME,
      // password: process.env.DEV_ENV_PASSWORD,
      // database: process.env.DEV_ENV_DATABASE,
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.ENV_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      // host: process.env.ENV_HOST,
      // port: process.env.ENV_PORT,
      // user: process.env.ENV_USERNAME,
      // password: process.env.ENV_PASSWORD,
      // database: process.env.ENV_DATABASE,
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds",
    },
  },
};
