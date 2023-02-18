import Carpark from "./Carpark";
import dbPool from "./dbPool";



class Main {
	
	private carpark:any;
	
	constructor() {

		// first create a Carpark object for each record in DB
		this.carpark = null;

		this.startEverything();

	}

	async startEverything() {
		await dbPool.createPool();
		
		const carpark_record = (await Carpark.getCarparkRecord()).rows[0];
		console.log(carpark_record);
		
		this.carpark = new Carpark(carpark_record.carpark_id, carpark_record.total_spaces, await Carpark.getFreeSpaces())
		await Carpark.start()
		console.log("STARTED");
	}
	
}



const app:Main = new Main();
console.log("hi");

process.on("SIGINT", () => {
	console.log("Exiting...")
	Carpark.shutdown();
})

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