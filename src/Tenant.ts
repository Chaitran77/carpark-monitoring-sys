import dbQuery from "./dbQuery";

class Tenant {
	public TenantID:number;
	public Forename:string;
	public Surname:string;

	constructor(TenantID: number, Forename: string, Surname: string) {
		this.TenantID = TenantID;
		this.Forename = Forename;
		this.Surname = Surname;
	}

	public static async getTenantDataFromLogID(log_id:number) {
        return (await dbQuery.makeDBQuery(`SELECT log_id, forename, surname FROM "Tenant", "Vehicle", "Log" WHERE "Log".log_id = $1 AND "Log".numberplate = "Vehicle".numberplate AND "Vehicle".tenant_id = "Tenant".tenant_id LIMIT 1;`, [log_id.toString()])).rows;
    }
}

export default Tenant;