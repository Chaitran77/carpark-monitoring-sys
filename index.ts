// import * as express from 'express'
import express from "express"

const { Client } = require('pg');
const dotenv = require("dotenv").config();

// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6

dotenv.config()

const getClient = async () => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: false,
  });
  await client.connect();
  return client;
};

const dbClient = await getClient();
const log_data = await dbClient.query("SELECT * FROM \"Log\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383
console.log(log_data.rows);

class Tenant {
    public TenantID;
    public Forename;
    public Surname;

    constructor(TenantID: number, Forename: String, Surname: String) {
        this.TenantID = TenantID;
        this.Forename = Forename;
        this.Surname = Surname;
    }
}

class Vehicle {
    public VehicleID;
    public Numberplate;
    public TenantID;

    constructor(VehicleID: number, Numberplate: String, TenantID: number) {
        this.VehicleID = VehicleID;
        this.Numberplate = Numberplate;
        this.TenantID = TenantID;
    }
}

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

class Camera {
    public CameraID;
    public IPAddress;
    public EventURL;
    public ResponseFormat;
    public CarparkID;

    constructor() {
        
    }
}

class Carpark {

}


class App {
    public express
    constructor() {
        this.express = express()
        this.loadRoutes()
    } 

    private loadRoutes() : void {
        const router = express.Router()
        router.get('/', (req, res) => {
            res.json({
                'message': 'Hello World!'
            })
            this.express.use('/', router);
        })
    }
}

export default new App().express;


 
// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e