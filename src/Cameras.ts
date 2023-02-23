import * as express from "express";
import Camera from "./Camera";
import Carpark from "./Carpark";
import dbQuery from "./dbQuery";
import Logs from "./Logs";
import Vehicle from "./Vehicle";

class Cameras {
    
    public static cameras: Camera[] = [];

    public static previousNumberplate:string;

    public static async getCameras() {
        return await dbQuery.makeDBQuery(`SELECT camera_id, ip_address, event_url, response_format, carpark_id FROM "Camera";`, []);
    }

    public static async loadCameras() {
        const cameraRecords = (await Cameras.getCameras()).rows;

        for (let i = 0; i < cameraRecords.length; i++) {
            const rec = cameraRecords[i];
            this.addCamera(new Camera(rec.camera_id, rec.ip_address, rec.event_url, rec.response_format, rec.carpark_id));
        }
    }

    private static addCamera(camera:Camera) {
        Cameras.cameras.push(camera);
    }

    private static getCameraIDFromIP(ip_address:string):number {        
        
        for (let i = 0; i < this.cameras.length; i++) {
            if (this.cameras[i].IPAddress == ip_address) return this.cameras[i].CameraID;
        }

        return -1;

    }


    public static async processEvent(request:express.Request, response:express.Response) {
		const detectedNumberplate = request.body["Picture"].Plate.PlateNumber;
		console.log("CAMERA ID" + this.getCameraIDFromIP(request.ip).toString());
		console.log("FREE SPACES: " + (await Carpark.getFreeSpaces()).toString());
		
		if (detectedNumberplate == this.previousNumberplate) {return} // stop executing if same numberplate
		if ((await Carpark.getFreeSpaces()) <= 0) { console.log("NO FREE SPACES"); return; } // stop executing if no free spaces

		const detectedVehicleImage = request.body["Picture"].NormalPic.Content;
		console.log(detectedNumberplate, request.body["Picture"].SnapInfo.Direction);
		

		if (request.body["Picture"].SnapInfo.Direction == "Reverse") {
			// vehicle is exiting, no need to check numberplate
			console.log("REVERSE");	
			Carpark.openGate()
			this.previousNumberplate = detectedNumberplate;
			await Logs.updateLogRecordOnExit(detectedNumberplate, detectedVehicleImage);

				
		} else if (request.body["Picture"].SnapInfo.Direction == "Obverse") {
			// vehicle is entering the carpark
			console.log("OBVERSE");
			
			
			if (await Vehicle.isKnown(detectedNumberplate)) { // something was returned, duplicate numberplates not allowed in table therefore only 1 record should be returned.
	
				console.log("KNOWN VEHICLE");
				Carpark.openGate();
				await Logs.createRecord(detectedNumberplate, detectedVehicleImage, true, this.getCameraIDFromIP(request.ip));

			} else { // nothing returned, unknown vehicle. PROTOCOL: Keep gate shut and notify reception
				console.log("UNKNOWN VEHICLE");
                await Logs.createRecord(detectedNumberplate, detectedVehicleImage, false, this.getCameraIDFromIP(request.ip));
			}


			this.previousNumberplate = detectedNumberplate;
		}

	}

}

export default Cameras;