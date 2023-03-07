import dbQuery from "./dbQuery";
import Log from "./Log";

abstract class Logs {

    private static logs: Log[] = [];


    public static getLogs():Log[] {
        return Logs.logs;
    }

    public static async loadLogs(count:number) { // loads the most recently created logs into Logs.logs[]
        var logRecords:any[] = [];

        const max_log_id:number = (await dbQuery.makeDBQuery(`SELECT log_id FROM "Log" ORDER BY log_id DESC LIMIT 1;`, [])).rows[0].log_id;

        
        // clear Logs.logs[], then populate with new Log() instances
        Logs.logs = [];

        for (let i = max_log_id; i > max_log_id-count; i--) {

            console.log("Getting log id " + i);

            const rec = (await dbQuery.makeDBQuery(`SELECT log_id, camera_id, numberplate, entry_timestamp, exit_timestamp, vehicle_id, entry_image_base64, exit_image_base64, known_vehicle FROM "Log" WHERE log_id = $1;`, [i.toString()])).rows[0];
            
            if (rec == undefined) {count+=1; continue};
            Logs.addLog(new Log(rec.log_id, rec.camera_id, rec.vehicle_id, rec.numberplate, rec.entry_timestamp, rec.exit_timestamp, rec.entry_image_base64, rec.exit_image_base64, rec.known_vehicle));
        }

    }

    private static addLog(log:Log) {
        Logs.logs.push(log);
    }

    public static async createRecord(numberplate:string, image:string, knownVehicle: boolean, camera_id: number, timestamp:string) {
		// TODO: need to match vehicle_id
        const secondsString = Logs.timestampStringToSeconds(timestamp).toString();
		await dbQuery.makeDBQuery(`INSERT INTO "Log" (numberplate, entry_timestamp, entry_image_base64, known_vehicle, camera_id) VALUES ($1, to_timestamp($2), $3, $4, $5);`, [numberplate, secondsString, image, knownVehicle.toString(), camera_id.toString()]);
	}

    public static async createRecordNoEntry(numberplate:string, image:string, knownVehicle: boolean, camera_id: number, timestamp:string) {
		// TODO: need to match vehicle_id
        // for when a vehicle is detected but doesn't enter (i.e. no free spaces available or unauthorised). Set entry and exit timestamps to be equal.
        const secondsString = Logs.timestampStringToSeconds(timestamp).toString();
		await dbQuery.makeDBQuery(`INSERT INTO "Log" (numberplate, entry_timestamp, entry_image_base64, exit_timestamp, known_vehicle, camera_id) VALUES ($1, to_timestamp($2), $3, to_timestamp($4), $5, $6);`,
                [numberplate, secondsString, image, secondsString, knownVehicle.toString(), camera_id.toString()]);
	}


	public static async updateLogRecordOnExit(numberplate:string, image:string, timestamp:string) {
		console.log(`UPDATE "Log" SET exit_timestamp = to_timestamp(${Logs.timestampStringToSeconds(timestamp)}), exit_image_base64 = '<image data here>' WHERE log_id = (SELECT MAX(log_id) FROM "Log" WHERE "Log".numberplate = '${numberplate}');`);		
		await dbQuery.makeDBQuery(`UPDATE "Log" SET exit_timestamp = to_timestamp($1), exit_image_base64 = $2 WHERE log_id = (SELECT MAX(log_id) FROM "Log" WHERE "Log".numberplate = $3);`, [Logs.timestampStringToSeconds(timestamp).toString(), image, numberplate]);
	}

    private static timestampStringToSeconds(timestampString:string) {
        // camera gives SnapTime in format "YYYY-MM-DD HH:mm:ss" e.g. "2023-03-03 18:15:04". Convert to millis since unix epoch, divide by 1000 to get seconds.
        return new Date(timestampString).getTime()/1000;
    }

}

export default Logs;