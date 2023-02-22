import * as express from "express";
import { Server } from "http";

import dbQuery from "./dbQuery";
import Cameras from "./Cameras";
import dbPool from "./dbPool";
import Logs from "./Logs";


class Carpark {

    private static serverListenPort = 8000;

    public static server: express.Application;
    public static httpServer: Server;

    public static CarparkID:number;
    public static TotalSpaces:number;
    public static FreeSpaces:number;


    constructor(CarparkID: number, TotalSpaces: number, FreeSpaces: number) {

        Carpark.CarparkID = CarparkID;
        Carpark.TotalSpaces = TotalSpaces;

        Carpark.FreeSpaces = FreeSpaces;
        // the start method must be run at a higher level
    }

    public static async start() {
        // spin up cameras - must be done before server starts (below)
        await Cameras.loadCameras();

        Carpark.server = express();
		Carpark.loadRoutes();
		Carpark.httpServer = Carpark.server.listen(this.serverListenPort, "0.0.0.0", () => { console.log("server listening") });
    }

    public static async getFreeSpaces() {
        // TODO: Change to correct query
		const totalSpaces = (await dbQuery.makeDBQuery(`SELECT total_spaces FROM "Carpark";`, [])).rows[0].total_spaces;
		const usedSpaces = (await dbQuery.makeDBQuery(`SELECT COUNT(*) AS used_spaces FROM "Log" WHERE exit_timestamp is NULL;`, [])).rows[0].used_spaces;
        return totalSpaces - usedSpaces;
	}


    public static async getCarparkRecord() {
        return (await dbQuery.makeDBQuery(`SELECT carpark_id, total_spaces, used_spaces FROM "Carpark";`, []));
    }

    // previous implementation used to update the counter in the database. Counter is now held in memory and derived from data in base
    // private async editCarparkSpaceCounter(increment:1|-1, cameraAddress:string) {
	// 	console.log(`UPDATE "Carpark" SET used_spaces = used_spaces + ${increment.toString()} FROM "Camera" WHERE "Carpark".carpark_id = "Camera".carpark_id AND "Camera".ip_address = '${cameraAddress}';`);
		
	// 	await dbQuery.makeDBQuery(`UPDATE "Carpark" SET used_spaces = used_spaces + $1 FROM "Camera" WHERE "Carpark".carpark_id = "Camera".carpark_id AND "Camera".ip_address = '$2';`, [increment.toString(), cameraAddress])
	// }

    public static openGate() {

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
		
		Carpark.server.use(express.json( { limit: "2mb" } ));

		Carpark.server.post("/NotificationInfo/TollgateInfo", async (req, res) => {
			try {
				await Cameras.processEvent(req, res);
				this.replySuccess(res);
			} catch (error:any) {
				this.replyQueryError(error, res);
			}
		})

		Carpark.server.post("/NotificationInfo/KeepAlive", (req: express.Request, res: express.Response) => { 
			console.log(req);
			const now:Date = new Date();
			res.send({"Message": "Success", "Result": true, "RspTime": `${now.getFullYear()}-0${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`})
			res.status(200);
			res.end();
		})


		// for requests from ReceptionUI.
		// TODO: Implement authentication

		// Carpark.server.get("/query/:table", async (req:express.Request, res:express.Response) => {
		// 	// query string will hold fields

		// })

		Carpark.server.post("/allVehicleTenantData", async (req:express.Request, res:express.Response) => {
			// returns tenant records joined with vehicle records

		});

		Carpark.server.get("/carparkStatistics", async (req:express.Request, res:express.Response) => {
			res.status(200);
			res.json({
				"FreeSpaces": await this.getFreeSpaces(), 
				"TotalSpaces": this.TotalSpaces
			})
			res.end();
		})

		Carpark.server.get("/logData/:recordCount/", async (req:express.Request, res:express.Response) => {
			// returns the most recent req.params.recordCount number of records in the Log table (highest id) 
			console.log("R E Q U E S T    FOR    L O G S");
			
			res.status(200);
			await Logs.loadLogs(parseInt(req.params.recordCount)); // load fresh logs from db
			res.json(Logs.getLogs());
			res.end()
		});

		Carpark.server.post("/insert/:table/", async (req: express.Request, res: express.Response) => {
			// for tables other than Log from receptionUI, not for numberplates.
			console.log(dbQuery.generateInsertQuery(req.params.table, req.body));
			res.status(201); // 201 Created HTTP status code
			res.send("Insert request completed successfully");
			res.end()
		})

		Carpark.server.get("/entryCount", async (req: express.Request, res: express.Response) => {
			const data = (await dbQuery.makeDBQuery(`SELECT numberplate, COUNT(*), MAX(entry_timestamp) FROM "Log" GROUP BY numberplate;`, [])).rows;

		})

		Carpark.server.post("/update/:table/", async (req: express.Request, res: express.Response) => {

		})
	}



    public static async shutdown() {
		this.httpServer.close();
		await dbPool.dbPool.end;
		process.disconnect();
		process.exit(0);
	}
    
}

export default Carpark;