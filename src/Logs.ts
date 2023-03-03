import dbQuery from "./dbQuery";
import Log from "./Log";

abstract class Logs {

    private static logs: Log[] = [];


    public static getLogs():Log[] {
        return Logs.logs;
    }

    public static async loadLogs(count:number) { // loads the most recently created logs into Logs.logs[]
        const logRecords = (await await dbQuery.makeDBQuery(`SELECT log_id, camera_id, numberplate, entry_timestamp, exit_timestamp, vehicle_id, entry_image_base64, exit_image_base64, acknowleged, known_vehicle FROM "Log" ORDER BY log_id DESC LIMIT $1;`, [count.toString()])).rows;

        // clear Logs.logs[], then populate with new Log() instances
        Logs.logs = [];
        for (let i = 0; i < logRecords.length; i++) {
            const rec = logRecords[i];
            this.addLog(new Log(rec.log_id, rec.camera_id, rec.vehicle_id, rec.numberplate, rec.entry_timestamp, rec.exit_timestamp, rec.entry_image_base64, rec.exit_image_base64, rec.acknowleged, rec.known_vehicle));
        }
    }

    private static addLog(log:Log) {
        Logs.logs.push(log);
    }

    public static async createRecord(numberplate:string, image:string, knownVehicle: boolean, camera_id: number) {
		// TODO: need to match vehicle_id
		await dbQuery.makeDBQuery(`INSERT INTO "Log" (numberplate, entry_timestamp, entry_image_base64, known_vehicle, camera_id, acknowleged) VALUES ($1, to_timestamp($2), $3, $4, $5, false);`, [numberplate, (Date.now()/1000).toString(), image, knownVehicle.toString(), camera_id.toString()]);
	}


	public static async updateLogRecordOnExit(numberplate:string, image:string) {
		console.log(`UPDATE "Log" SET exit_timestamp = to_timestamp(${Date.now()/1000}), exit_image_base64 = '<image data here>' WHERE log_id = (SELECT MAX(log_id) FROM "Log" WHERE "Log".numberplate = '${numberplate}');`);		
		await dbQuery.makeDBQuery(`UPDATE "Log" SET exit_timestamp = to_timestamp($1), exit_image_base64 = $2 WHERE log_id = (SELECT MAX(log_id) FROM "Log" WHERE "Log".numberplate = $3);`, [(Date.now()/1000).toString(), image, numberplate]);
	}


}

export default Logs;