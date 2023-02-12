

const { Client } = require('pg');
const dotenv = require("dotenv").config();
import server from "./Server";

const serverListenPort = 8000;

// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6

// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript

// connect to local Postgresql database using credentials in the .env file
const getClient = async () => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: false,
  });
  await client.connect();
  return client;
};

// sample query
// (async () => {
// 	const dbClient = await getClient();
// 	const log_data = await dbClient.query("SELECT * FROM \"Log\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383
// 	console.log(log_data.rows);
// 	await dbClient.end();
// })

class Main {

    private dbClient: Object;

    constructor() {
        this.dbClient = async () => {
            return await getClient();
        }
    }

}



server.listen(serverListenPort, () => {
	// if (err) return console.log(err);
	console.log("Server running on port ", serverListenPort);
	
})