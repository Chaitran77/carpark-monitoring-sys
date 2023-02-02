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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// import * as express from 'express'
var express_1 = require("express");
var Client = require('pg').Client;
var dotenv = require("dotenv").config();
// https://northflank.com/guides/connecting-to-a-postgresql-database-using-node-js
// https://medium.com/bb-tutorials-and-thoughts/how-to-build-nodejs-rest-api-with-express-and-postgresql-typescript-version-121b5a11c9a6
dotenv.config();
var getClient = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new Client({
                    host: process.env.PG_HOST,
                    port: process.env.PG_PORT,
                    user: process.env.PG_USER,
                    password: process.env.PG_PASSWORD,
                    database: process.env.PG_DATABASE,
                    ssl: false
                });
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                return [2 /*return*/, client];
        }
    });
}); };
var dbClient = await getClient();
var log_data = await dbClient.query("SELECT * FROM \"Log\""); // referencing mixed-case table names https://stackoverflow.com/a/695312/7169383
console.log(log_data.rows);
var Tenant = /** @class */ (function () {
    function Tenant(TenantID, Forename, Surname) {
        this.TenantID = TenantID;
        this.Forename = Forename;
        this.Surname = Surname;
    }
    return Tenant;
}());
var Vehicle = /** @class */ (function () {
    function Vehicle(VehicleID, Numberplate, TenantID) {
        this.VehicleID = VehicleID;
        this.Numberplate = Numberplate;
        this.TenantID = TenantID;
    }
    return Vehicle;
}());
var Log = /** @class */ (function () {
    function Log() {
    }
    return Log;
}());
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
// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e
