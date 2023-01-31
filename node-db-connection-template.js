const dotenv = require("dotenv")
const { Client } = require('pg');

dotenv.config()

getClient = async () => {
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

client = await getClient();
await client.query("SELECT * FROM \"Tenant\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383