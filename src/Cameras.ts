import * as express from "express";
import Camera from "./Camera";
import Carpark from "./Carpark";
import dbQuery from "./dbQuery";
import Logs from "./Logs";
import Vehicle from "./Vehicle";

abstract class Cameras {
    
	public static cameras: Camera[] = [];

    public static async loadCameras() {
        const cameraRecords = (await dbQuery.makeDBQuery(`SELECT camera_id, ip_address, event_url, response_format, carpark_id FROM "Camera";`, [])).rows;

        for (let i = 0; i < cameraRecords.length; i++) {
            const rec = cameraRecords[i];
            Cameras.addCamera(new Camera(rec.camera_id, rec.ip_address, rec.event_url, rec.response_format, rec.carpark_id));
        }
    }

    private static addCamera(camera:Camera) {
        Cameras.cameras.push(camera);
    }

    private static getCameraIDFromIP(ip_address:string):number {        
        
        for (let i = 0; i < Cameras.cameras.length; i++) {
            if (Cameras.cameras[i].IPAddress == ip_address) return Cameras.cameras[i].CameraID;
        }

        return -1;

    }


    public static async processEvent(request:express.Request, response:express.Response) {
		const detectedNumberplate = request.body["Picture"].Plate.PlateNumber;
		console.log("CAMERA ID: " + Cameras.getCameraIDFromIP(request.ip).toString());
		console.log("FREE SPACES: " + (await Carpark.getFreeSpaces()).toString());
		
		
		const detectedVehicleImage = request.body["Picture"].NormalPic.Content;
		const detectedVehicleTimestamp = request.body["Picture"].SnapInfo.SnapTime;
		console.log(detectedNumberplate, request.body["Picture"].SnapInfo.Direction);
	
		
		if (request.body["Picture"].SnapInfo.Direction == "Reverse") {
			// vehicle exiting, no need to check numberplate
			Carpark.openGate(request, response)
			await Logs.updateLogRecordOnExit(detectedNumberplate, detectedVehicleImage, detectedVehicleTimestamp);

				
		} else if (request.body["Picture"].SnapInfo.Direction == "Obverse") {
			// vehicle entering carpark
			if (await Vehicle.isKnown(detectedNumberplate)) { 
				// something returned, duplicate numberplates not allowed in table therefore only 1 record will be returned.
	
				console.log("KNOWN VEHICLE");
				if ((await Carpark.getFreeSpaces()) <= 0) {
					await Logs.createRecordNoEntry(detectedNumberplate, detectedVehicleImage, true, Cameras.getCameraIDFromIP(request.ip), detectedVehicleTimestamp);
				} else {
					Carpark.openGate(request, response);
					await Logs.createRecord(detectedNumberplate, detectedVehicleImage, true, Cameras.getCameraIDFromIP(request.ip), detectedVehicleTimestamp);
				}

			} else {
				// nothing returned, unknown vehicle: Keep gate shut and notify reception (by setting known_vehicle to false), independent of free spaces
				console.log("UNKNOWN VEHICLE");
                await Logs.createRecordNoEntry(detectedNumberplate, detectedVehicleImage, false, Cameras.getCameraIDFromIP(request.ip), detectedVehicleTimestamp);
			}

		} else {
			// camera reported "Unknow" as plate direction
			// need to decipher from existing Log data
		}

	}


}

export default Cameras;