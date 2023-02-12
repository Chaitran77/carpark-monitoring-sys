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
const Server_1 = require("./Server");
require("dotenv").config();
const serverListenPort = 8000;
// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6
// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
// connect to local Postgresql database using credentials in the .env file
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
// sample query
// (async () => {
// 	const dbClient = await getClient();
// 	const log_data = await dbClient.query("SELECT * FROM \"Log\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383
// 	console.log(log_data.rows);
// 	await dbClient.end();
// })
class Main {
    constructor() {
        this.lastNumberplate = "";
        this.dbClient = () => __awaiter(this, void 0, void 0, function* () {
            return yield getClient();
        });
        this.makeDBQuery("SELECT * FROM \"Log\"").then((result) => {
            console.log(result.rows);
        });
    }
    handleNumberplateEvent() {
    }
    makeDBQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataPromise = this.dbClient.query(query);
            this.dbClient.end();
            return dataPromise;
        });
    }
}
Server_1.default.listen(serverListenPort, () => {
    // if (err) return console.log(err);
    console.log("Server running on port ", serverListenPort);
});
