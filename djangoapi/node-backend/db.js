const { Pool } = require("pg");

// PostgreSQL connection pool
const pool = new Pool({
  user: "viki",            // same as Django USER
  host: "127.0.0.1",       // same as Django HOST
  database: "coredb",      // same as Django NAME
  password: "410554",      // same as Django PASSWORD
  port: 5432,              // default PostgreSQL port (Django left PORT empty, defaults to 5432)
});

module.exports = pool;