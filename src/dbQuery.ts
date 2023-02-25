import dbPool from "./dbPool";

require("dotenv").config();

abstract class dbQuery  {

	public static generateInsertQuery(table:string, parameters:object):string {

		const keys = Object.keys(parameters);
		const values = Object.values(parameters);

		const query = `INSERT INTO ${ table } (${ keys }) VALUES (${ values })`;
		return query;
	}

	public static async makeDBQuery(query:string, parameters:Array<string>) {
		// console.log(`QUERY: ${query}`)
		const result = await dbPool.dbPool.query(query, parameters)
		
		return result;
	}

}

export default dbQuery;