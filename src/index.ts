
import * as express from "express";
// import router from "./Server";

const { Client } = require("pg");
require("dotenv").config();


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


class Main {
	
	private lastNumberplate:string = "";
	private dbClient: typeof Client;

	private serverListenPort = 8000;

	public server: express.Application;
	
	constructor() {
		this.server = express();
		this.loadRoutes();
		this.server.listen(this.serverListenPort, () => { console.log("server listening") });
		
		this.dbClient = async () => {
			return await getClient();
		}
		
		// this.makeDBQuery("SELECT * FROM \"Log\"").then((result:pg.QueryResult) => {
		//   console.log(result.rows);
		// })

	}
	
	public handleNumberplateEvent(request:express.Request):void {
		console.log(request.body["Picture"].Plate.PlateNumber)
	}

	private async makeDBQuery(query:string):Promise<any> {
		const dataPromise = this.dbClient.query(query);
		this.dbClient.end()
		return dataPromise;
	}
	
	private loadRoutes(): void {
		
		this.server.use(express.json( { limit: "2mb" } ));

		// this.express.use("/", (req, res) => {
		// 	console.log(req.body);
		// })

		this.server.post("/NotificationInfo/TollgateInfo", (req: express.Request, res: express.Response) => { 
			console.log(req);
			this.handleNumberplateEvent(req);
		})

		this.server.post("/insert/:table/", () => {
			
		})

		this.server.post("/update/:table/", () => {

		})
	}
	
}



export default new Main().server;

// const server = express();

// server.use(express.json( { limit: "2mb" }));

// server.post("/NotificationInfo/TollgateInfo", (req: Request, res: Response) => { 
	// 	console.log(req);
	// })
	
	// server.listen(serverListenPort, () => {
		// 	// if (err) return console.log(err);
		// 	console.log("Server running on port ", serverListenPort);
	
// })

// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6
// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript

// sample query
// (async () => {
// 	const dbClient = await getClient();
// 	const log_data = await dbClient.query("SELECT * FROM \"Log\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383
// 	console.log(log_data.rows);
// 	await dbClient.end();
// })