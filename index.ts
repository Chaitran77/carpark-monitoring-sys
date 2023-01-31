// import * as express from 'express'
import express from "express"

const { Client } = require('pg');
const dotenv = require("dotenv").config();
// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6

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
    public EntryTime;
    public ExitTime;
    public EntryImageBase64;
    public ExitImageBase64;
    // https://stackoverflow.com/a/42884828 to store dates/times 

    // constructor(EventID: number, CameraID: number, VehicleID: number, Numberplate: String, EntryTime: ) {
    //     this.TenantID = TenantID;
    //     this.Forename = Forename;
    //     this.Surname = Surname;
    // }
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