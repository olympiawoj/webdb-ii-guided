const server = require("./api/server.js");

const knex = require("knex");

const knexConfig = {
  client: "sqlite3", //this is my client, sqlite3 is the package we installed & the driver and it’s going to look for sqlite3 in my node modules folder
  connection: {
    //connection either string or object
    filename: "./data/roles.db3"
  },
  useNullAsDefault: true //needed for sqlite, not other dbs}
};

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
