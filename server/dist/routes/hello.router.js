"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloRouteur = void 0;
const express_1 = __importDefault(require("express"));
const helloRouteur = express_1.default.Router();
exports.HelloRouteur = helloRouteur;
// With middlewares you can ensure the user is authenticated
// before requesting secured API routes
helloRouteur.use((request, response, next) => {
    var _a;
    process.stdout.write('HelloRouter Middleware\n');
    if ((_a = request.ip) === null || _a === void 0 ? void 0 : _a.endsWith('127.0.0.1')) {
        process.stdout.write('Request from local IP\n');
        next();
    }
    else {
        next();
    }
});
helloRouteur.get('/', (request, response) => {
    response.send('Hello TIW8 !');
});
