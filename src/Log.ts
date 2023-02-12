class Log {
	public EventID;
	public CameraID;
	public VehicleID;
	public Numberplate;
	public EntryTimestamp;
	public ExitTimestamp;
	public EntryImageBase64;
	public ExitImageBase64;
	// https://stackoverflow.com/a/42884828 to store dates/times 
	// client.query will return a timestamp String in the promise result rows

	constructor(EventID: number, CameraID: number, VehicleID: number, Numberplate: String, EntryTimestamp: Date, ExitTimestamp: Date, EntryImageBase64: String, ExitImageBase64: String) {
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