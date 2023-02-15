"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Client } = require('pg');
const dotenv = require("dotenv").config();
const server_1 = require("./server");
const serverListenPort = 8000;
// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6
// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
const getClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        ssl: false,
    });
    yield client.connect();
    return client;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const dbClient = yield getClient();
    const log_data = yield dbClient.query("SELECT * FROM \"Log\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383
    console.log(log_data.rows);
    yield dbClient.end();
}));
class Tenant {
    constructor(TenantID, Forename, Surname) {
        this.TenantID = TenantID;
        this.Forename = Forename;
        this.Surname = Surname;
    }
}
class Vehicle {
    constructor(VehicleID, Numberplate, TenantID) {
        this.VehicleID = VehicleID;
        this.Numberplate = Numberplate;
        this.TenantID = TenantID;
    }
}
class Log {
    // https://stackoverflow.com/a/42884828 to store dates/times 
    // client.query will return a timestamp String in the promise result rows
    constructor(EventID, CameraID, VehicleID, Numberplate, EntryTimestamp, ExitTimestamp, EntryImageBase64, ExitImageBase64) {
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
    constructor() {
    }
}
class Carpark {
}
server_1.default.listen(serverListenPort, (err) => {
    if (err)
        return console.log(err);
    return console.log("Server running on port ", serverListenPort);
});
