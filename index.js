"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// import * as express from 'express'
var express_1 = __importDefault(require("express"));
var App = /** @class */ (function () {
    function App() {
        this.express = (0, express_1["default"])();
        this.loadRoutes();
    }
    App.prototype.loadRoutes = function () {
        var _this = this;
        var router = express_1["default"].Router();
        router.get('/', function (req, res) {
            res.json({
                'message': 'Hello World!'
            });
            _this.express.use('/', router);
        });
    };
    return App;
}());
exports["default"] = new App().express;
// const dotenv = require("dotenv");
// dotenv.config();
// console.log("hello world");
// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e
