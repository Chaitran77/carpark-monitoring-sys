"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class Server {
    constructor() {
        this.express = express();
        this.loadRoutes();
    }
    loadRoutes() {
        this.express.use(express.json({ limit: '2mb' }));
        // this.express.get('/', (req, res) => {
        //     res.json({
        //         'message': 'Hello World!'
        //     })
        // })
        this.express.post('/', (req, res) => {
            console.log(req.body);
        });
    }
}
exports.default = new Server().express;
// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e
