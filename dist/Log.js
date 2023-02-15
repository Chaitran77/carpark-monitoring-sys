"use strict";
class Log {
    // https://stackoverflow.com/a/42884828 to store dates/times 
    // client.query will return a timestamp String in the promise result rows
    constructor(EventID, CameraID, VehicleID, Numberplate, EntryTimestamp, ExitTimestamp, EntryImageBase64, ExitImageBase64) {
        this.EventID = EventID;
        this.CameraID = CameraID;
        this.VehicleID = VehicleID;
        this.Numberplate = Numberplate;
        this.EntryTimestamp = EntryTimestamp;
        this.ExitTimestamp = ExitTimestamp;
        this.EntryImageBase64 = EntryImageBase64;
        this.ExitImageBase64 = ExitImageBase64;
    }
}
