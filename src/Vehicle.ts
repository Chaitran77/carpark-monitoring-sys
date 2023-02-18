import dbQuery from "./dbQuery";

abstract class Vehicle {
	public VehicleID;
	public Numberplate;
	public TenantID;

	constructor(VehicleID: number, Numberplate: String, TenantID: number) {
		this.VehicleID = VehicleID;
		this.Numberplate = Numberplate;
		this.TenantID = TenantID;
	}

	public static async getAllData() {
		return await dbQuery.makeDBQuery(`SELECT vehicle_id, numberplate, tenant_id FROM "Vehicle";`, [])
	};

	public static async getData(numberplate:string) {
		return await dbQuery.makeDBQuery(`SELECT vehicle_id, numberplate, tenant_id FROM "Vehicle" WHERE numberplate = $1;`, [numberplate]);
	}

	public static async isKnown(numberplate:string) {
		if ((await this.getData(numberplate)).rows.length > 0) return true;
		return false;
	}
}

export default Vehicle;