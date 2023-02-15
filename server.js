"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class Server {
    constructor() {
        this.express = express();
        this.loadRoutes();
    }
    loadRoutes() {
        this.express.use('/', function (req, res, next) {
            console.log(req.baseUrl, req.originalUrl);
            next();
        });
        // const router = express.Router()
        // router.get('/', (req, res) => {
        //     res.json({
        //         'message': 'Hello World!'
        //     })
        //     this.express.use('/', router);
        // })
        // router.post('', (req, res) => {
        //     console.log(req);
        // })
    }
}
exports.default = new Server().express;
// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e
