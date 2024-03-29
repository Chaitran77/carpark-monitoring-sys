import * as express from "express";
import { Server } from "http";

import Authentication from "./Authentication";
import dbQuery from "./dbQuery";
import Cameras from "./Cameras";
import dbPool from "./dbPool";
import Logs from "./Logs";
import Tenant from "./Tenant";


class Carpark {


    public static server: express.Application;
    public static httpServer: Server;

	private static CarparkID: number;
	private static TotalSpaces: number;
    
	public static tenants:Tenant[];


    constructor(CarparkID: number, TotalSpaces: number) {

        Carpark.CarparkID = CarparkID;
        Carpark.TotalSpaces = TotalSpaces;
        // the start method must be run at a higher level
    }


    public static async start() {
        // spin up cameras - must be done before server starts (below)
        await Cameras.loadCameras();

        Carpark.server = express();
		Carpark.loadRoutes();

		// get the server's listen port from .env file. Could not be defined in file (returns undefined), so automatically assign 8000 in this case as the default.
		const serverListenPort:number = (process.env.SERVERLISTENPORT !== undefined)?parseInt(process.env.SERVERLISTENPORT):(8000);

		// start listening and store HTTPServer instance for graceful shutdown
		Carpark.httpServer = Carpark.server.listen(serverListenPort, "0.0.0.0", () => { console.log("server listening") });

		// if any request takes longer than 
		// Carpark.httpServer.on('connection', function(socket) {
		// 	socket.setTimeout(10000, () => {console.log("Request timed out");});
		// });
    }

	// count number of Log records without exit timestamps (still in carpark), get total spaces in carpark and return difference between them. 
    public static async getFreeSpaces() { // not getUsedSpaces because this can be used directly in Cameras.processEvent(), 1 extra call here.
		const totalSpaces = (await dbQuery.makeDBQuery(`SELECT total_spaces FROM "Carpark";`, [])).rows[0].total_spaces;
		const usedSpaces = (await dbQuery.makeDBQuery(`SELECT COUNT(*) AS used_spaces FROM "Log" WHERE exit_timestamp IS NULL;`, [])).rows[0].used_spaces; // count Log records without an exit_timestamp
        return totalSpaces - usedSpaces;
	}


    public static async getCarparkRecords() {
        return (await dbQuery.makeDBQuery(`SELECT carpark_id, total_spaces FROM "Carpark";`, []));
    }

    // previous implementation used to update the counter in the database. Free spaces are now derived from data in base on demand.
    /*
	private async editCarparkSpaceCounter(increment:1|-1, cameraAddress:string) {
	 	console.log(`UPDATE "Carpark" SET used_spaces = used_spaces + ${increment.toString()} FROM "Camera" WHERE "Carpark".carpark_id = "Camera".carpark_id AND "Camera".ip_address = '${cameraAddress}';`);
		
	 	await dbQuery.makeDBQuery(`UPDATE "Carpark" SET used_spaces = used_spaces + $1 FROM "Camera" WHERE "Carpark".carpark_id = "Camera".carpark_id AND "Camera".ip_address = '$2';`, [increment.toString(), cameraAddress])
	}
	*/

	public static openGate(req: express.Request, res: express.Response) {
		// code to send request to activate camera relay
	}

    private static async openGateFromClient(req: express.Request, res: express.Response) {
		// can only open gate for unknown vehicle that has not entered (entry_tsp==exit_tsp)
		const LogID:number = parseInt(req.params.LogID);
		const logToModify = await Logs.getLogByID(LogID);
		
		if ((logToModify.entry_timestamp.toString() == logToModify.exit_timestamp.toString()) && !logToModify.known_vehicle) {
			
			Logs.setExitTimestampNullForLogID(LogID);
			Carpark.replySuccess(res);
		} else {
			res.status(403)
				.send("Cannot open gate for a vehicle that has already entered or is authorised")
				.end()
		}

    }


    private static replyQueryError(err: Error, res:express.Response) {
		// bad query so send status 400 with error message
		console.log("QUERY ERROR\n", err);
		
		res.status(400)
			.send("Query failed with error: " + err.message)
			.end();
	}

	private static replySuccess(res: express.Response) {
		res.status(200)
			.end();
	}

	private static loadRoutes(): void {
		
		Carpark.server.use(express.json( { limit: "10mb" } ));

		
		// this will resolve to "/NotificationInfo/TollgateInfo" with Dahua cameras (true for this project)
		Carpark.server.post(Cameras.cameras[0].EventURL, async (req, res) => {
			console.log(req.body);
			console.log(new Date().toString());
			res.json({"Result":true});
			try {				
				await Cameras.processEvent(req, res);
				this.replySuccess(res);
			} catch (error:any) {
				//this.replyQueryError(error, res);
				console.error(error);
				res.status(200);
				res.end() // for now
			}
		})
		
		Carpark.server.post("/NotificationInfo/KeepAlive", (req: express.Request, res: express.Response) => { 
			Carpark.replySuccess(res);
		})
		
		
		// for requests from ReceptionUI.
		
		// Carpark.server.get("/query/:table", async (req:express.Request, res:express.Response) => {
		// 	// query string will hold fields
		
		// })
		const authBarrierAdminRoute = Authentication.authBarrier(true);
		const authBarrierBaseRoute = Authentication.authBarrier(false);
		
		Carpark.server.get("/loginSalt", async (req: express.Request, res: express.Response) => {
			const username:string|any = req.query.username;
			
			res.send((await Authentication.getLoginSalt(username)));
			res.status(200);
			res.end();
		})

		Carpark.server.post("/login", authBarrierBaseRoute, async (req: express.Request, res: express.Response) => {
			// essentially a check so the user can know immediately if their credentials do not work; there is no is_logged_in state or token to change
			res.status(200).send("Valid credentials");
			res.end();
		})

		Carpark.server.get("/tenantDataFromLogID/:LogID", authBarrierBaseRoute, async (req:express.Request, res:express.Response) => {
			// returns tenant records joined with vehicle records
			res.status(200);
			const tenantData = await Tenant.getTenantDataFromLogID(parseInt(req.params.LogID));
			console.log(tenantData);
			
			try {
				res.json({ // undefined will be picked up on client and interpreted as vehicle not belonging to tenant if no records returned
					"TenantID": tenantData[0]?.tenant_id,
					"Forename": tenantData[0]?.forename, 
					"Surname": tenantData[0]?.surname
				})
				res.end();
			} catch (error:any) {
				this.replyQueryError(error, res);
			}

		});

		Carpark.server.get("/carparkStatistics", async (req:express.Request, res:express.Response) => {
			res.status(200);
			try {
				res.json({
					"FreeSpaces": await this.getFreeSpaces(), // will always return a record
					"TotalSpaces": this.TotalSpaces
				})
				res.end();
			} catch (error:any) {
				this.replyQueryError(error, res);
			}
		})

		Carpark.server.get("/logData/:recordCount", authBarrierBaseRoute, async (req:express.Request, res:express.Response) => {
			// returns the most recent req.params.recordCount number of records in the Log table (highest id) 
			console.log("R E Q U E S T    FOR    L O G S");
			
			res.status(200);
			await Logs.loadLogs(parseInt(req.params.recordCount)); // load fresh logs from db
			res.json(Logs.getLogs());
			res.end()
		});

		Carpark.server.get("/entryCount/:TenantID", async (req: express.Request, res: express.Response) => {
			// TODO: JOIN with Tenant and Vehicle for more information.
			const data = (await dbQuery.makeDBQuery(`SELECT numberplate, COUNT(*), MAX(entry_timestamp) FROM "Log" GROUP BY numberplate;`, [])).rows;

		})

		Carpark.server.post("/openGate/:LogID", authBarrierBaseRoute, async (req: express.Request, res: express.Response) => {this.openGateFromClient(req, res)});
	}



    public static async shutdown() {
		this.httpServer.close();
		await dbPool.dbPool.end();
		process.disconnect();
		process.exit(0);
	}
    

}

export default Carpark;
