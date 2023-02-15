
import * as express from "express";
import { Server } from "http";
import { QueryResult } from "pg";
// import router from "./Server";

const { Pool } = require("pg");
require("dotenv").config();


// connect to local Postgresql database using credentials in the .env file
function createPool() {
	const pool = new Pool({
	  host: process.env.PG_HOST,
	  port: process.env.PG_PORT,
	  user: process.env.PG_USER,
	  password: process.env.PG_PASSWORD,
	  database: process.env.PG_DATABASE,
	  ssl: false,
	});
	return pool;
};


class Main {
	
	private previousNumberplate:string = "";
	private dbPool: typeof Pool;

	private serverListenPort = 8000;

	public server: express.Application;
	public httpServer: Server;
	
	constructor() {
		this.server = express();
		this.loadRoutes();
		this.httpServer = this.server.listen(this.serverListenPort, () => { console.log("server listening") });
		
		this.dbPool = createPool();
		
		this.makeDBQuery("SELECT * FROM \"Log\"", []).then((result:QueryResult) => {
		  console.log(result.rows);
		})

	}
	
	public async handleNumberplateEvent(request:express.Request, response:express.Response) {
		const detectedNumberplate = request.body["Picture"].Plate.PlateNumber;
		console.log(detectedNumberplate, request.body["Picture"].SnapInfo.Direction);
		if (detectedNumberplate == this.previousNumberplate) {return}

		if (request.body["Picture"].SnapInfo.Direction == "Reverse") {
			// vehicle is exiting, no need to check numberplate
			console.log("REVERSE");	
			this.openGate()
			await this.editCarparkSpaceCounter(-1);
			this.previousNumberplate = detectedNumberplate;
				
		} else if (request.body["Picture"].SnapInfo.Direction == "Obverse") {
			// vehicle is entering the carpark
			console.log("OBVERSE");
			
			const data = await this.makeDBQuery("SELECT * FROM \"Vehicle\" WHERE numberplate = '$1';", [detectedNumberplate])
			console.log(data.rows);

			this.editCarparkSpaceCounter(1);
			this.previousNumberplate = detectedNumberplate;
		} else {
			console.log("UNKNOWN VEHICLE DIRECTION " + request.body["Picture"].SnapInfo.Direction);
		}

	}

	private openGate() {}
	
	private generateInsertQuery(table:string, parameters:object):string {

		const keys = Object.keys(parameters);
		const values = Object.values(parameters);

		const query = `INSERT INTO ${ table } (${ keys }) VALUES (${ values })`;
		return query;
	}

	private async editCarparkSpaceCounter(increment:1|-1) {
		console.log("UPDATE \"Carpark\" SET used_spaces = used_spaces " + increment.toString() + ";");
		
		await this.makeDBQuery("UPDATE \"Carpark\" SET used_spaces = used_spaces + $1;", [increment.toString()])
	}


	private async makeDBQuery(query:string, parameters:Array<string>) {

		const result = await this.dbPool.query(query, parameters)
		return result;
		// const dataPromise = this.dbPool.query(query);
		// return dataPromise;
	}

	private handleQueryError(err: Error, res:express.Response) {
		// bad query so send status 400 with error message
		console.log("QUERY ERROR\n", err.message);
		
		res.status(400)
			.send("Query failed with error: " + err.message)
			.end();
	}

	private replySuccess(res: express.Response) {
		res.status(200)
			.end();
	}
	
	private loadRoutes(): void {
		
		this.server.use(express.json( { limit: "2mb" } ));

		this.server.post("/NotificationInfo/TollgateInfo", async (req, res) => {
			try {
				await this.handleNumberplateEvent(req, res);
				this.replySuccess(res);
			} catch (error:any) {
				this.handleQueryError(error, res);
			}
		})

		this.server.post("/NotificationInfo/KeepAlive", (req: express.Request, res: express.Response) => { 
			console.log(req);
			res.send({"Message": "Success", "Result": true, "RspTime": ""})
			res.status(200);
			res.end();
		})

		this.server.post("/insert/:table/", async (req: express.Request, res: express.Response) => {
			// for tables other than Log from receptionUI, not for numberplates.
			console.log(this.generateInsertQuery(req.params.table, req.body));
			res.send("Insert request completed successfully");
			res.status(200);
			res.end()
		})

		this.server.post("/update/:table/", async (req: express.Request, res: express.Response) => {

		})
	}

	public async shutdown() {
		this.httpServer.close();
		await this.dbPool.end;
		process.exit(0);
	}
	
}



const app:Main = new Main();

process.on("SIGINT", () => {
	console.log("Exiting...")
	app.shutdown();
})
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