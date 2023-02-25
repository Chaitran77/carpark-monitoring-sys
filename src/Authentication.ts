import * as express from "express";
import dbQuery from "./dbQuery";

abstract class Authentication {

    // SOURCE: Credit to https://emn178.github.io/online-tools/sha256.html for simple hashing tool. Used to manually generate initial hashes, then hashes with salts.

    // check if provided credentials are valid for route being accessed
    public static authBarrier(isAdministratorLevel:boolean) {

        // since isAdministratorLevel needs to be passed with the default express parameters, a new modified function is returned which has access to both but also has the correct method signature for Express.
        // Source: Express docs, section "Configurable middleware" at bottom of page: https://expressjs.com/en/guide/writing-middleware.html
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
           
            // if the parameters are not present in the request, set them equal to ""
            console.log(req.headers);
            
            // types for req.headers are string|string[]|any|(etc...), so cast to string since it will never be any other type (except null) 
            const username:string = <string>req.headers["username"]??""; // fallback to "" if is null
            const passwordHash:string = <string>req.headers["passwordhash"]??"";
                       

            // if valid, proceed to next layer in middleware stack and stop execution of this function
            if (await this.checkHash(username, passwordHash) && await this.checkUserLevel(username, isAdministratorLevel)) return next(); 

            res.status(403).send(`Resource forbidden: Current user does not have required user level for access to ${req.path}`); // forbidden, refused to serve requested resource, different to 401
        }
        
    }
    
    private static async checkHash(username:string, hash:string) {
        // if either are undefined or the user doesn't exist, storedHash will be undefined, making the final comparison false
        const storedHash = (await dbQuery.makeDBQuery(`SELECT password_hash FROM "Account" WHERE username = $1`, [username]))?.rows[0]?.password_hash;
        return storedHash == hash;
    }
    
    private static async checkUserLevel(username:string, isAdministratorRoute:boolean) {
        // isAdministratorRoute is true when trying to access a route that only administrator-level users should be able to access
        const isUserAdminLevel = (await dbQuery.makeDBQuery(`SELECT administrator_level FROM "Account" WHERE username = $1`, [username]))?.rows[0]?.administrator_level;
        // Admins should be able to access all routes so return true if admin
        if (isUserAdminLevel) {
            return true;
        } else { // not admin
            return isUserAdminLevel == isAdministratorRoute; // admin and trying to access admin route?
        }
    }

    public static async getLoginSalt(username: string) {
        // ?. allows undefined to be returned (which is desired here)
        return (await dbQuery.makeDBQuery(`SELECT salt FROM "Account" WHERE username = $1;`, [username]))?.rows[0]?.salt;
    }
}

export default Authentication;