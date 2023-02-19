class Log {

	public EventID: number;
	public CameraID: number;
	public VehicleID: number;
	public Numberplate: string;
	public EntryTimestamp: Date;
	public ExitTimestamp: Date;
	public EntryImageBase64: string;
	public ExitImageBase64: string;
	public Acknowledged: boolean;
	public KnownVehicle: boolean;
	// https://stackoverflow.com/a/42884828 to store dates/times 
	// client.query will return a timestamp String in the promise result rows

	constructor(EventID: number, CameraID: number, VehicleID: number, Numberplate: string, EntryTimestamp: Date, ExitTimestamp: Date, EntryImageBase64: string, ExitImageBase64: string, Acknowledged: boolean, KnownVehicle: boolean) {
		this.EventID = EventID;
		this.CameraID = CameraID;
		this.VehicleID = VehicleID;
		this.Numberplate = Numberplate;
		this.EntryTimestamp = EntryTimestamp;
		this.ExitTimestamp = ExitTimestamp;
		this.EntryImageBase64 = EntryImageBase64;
		this.ExitImageBase64 = ExitImageBase64;
		this.Acknowledged = Acknowledged;
		this.KnownVehicle = KnownVehicle;
	}
	
}

export default Log;
