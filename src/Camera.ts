class Camera {
    public CameraID: number;
    public IPAddress: String;
    public EventURL: String;
    public ResponseFormat: String;
    public CarparkID: number; 

    constructor(CameraID: number, IPAddress: String, EventURL: String, ResponseFormat: String, CarparkID: number) {
		this.CameraID = CameraID;
		this.IPAddress = IPAddress;
		this.EventURL = EventURL;
		this.ResponseFormat = ResponseFormat;
		this.CarparkID = CarparkID;
    }
}
