class Camera {

	public CameraID: number;
	public IPAddress: string;
	public EventURL: string;
	public ResponseFormat: string;
	public CarparkID: number; 

	constructor(CameraID: number, IPAddress: string, EventURL: string, ResponseFormat: string, CarparkID: number) {
		this.CameraID = CameraID;
		this.IPAddress = IPAddress;
		this.EventURL = EventURL;
		this.ResponseFormat = ResponseFormat;
		this.CarparkID = CarparkID;
	}
}

export default Camera;