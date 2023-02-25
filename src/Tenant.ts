class Tenant {
	public TenantID:number;
	public Forename:string;
	public Surname:string;

	constructor(TenantID: number, Forename: string, Surname: string) {
		this.TenantID = TenantID;
		this.Forename = Forename;
		this.Surname = Surname;
	}
}

export default Tenant;