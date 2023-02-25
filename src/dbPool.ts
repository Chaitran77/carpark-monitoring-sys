const { Pool } = require("pg");

// Referenced https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js and
// https://node-postgres.com/apis/pool for below and to create sample query snippet in index.ts

abstract class dbPool {
	public static dbPool: typeof Pool;

	public static async createPool() {
		// connect to local Postgresql database using credentials in local .env file
		dbPool.dbPool = await new Pool({
			host: process.env.PG_HOST,
			port: process.env.PG_PORT,
			user: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DATABASE,
			ssl: false,
		});
	}

}

export default dbPool;