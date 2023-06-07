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
exports.listUsers = exports.addUsers = exports.listProjectNames = exports.addProject = void 0;
const mongodb_1 = require("mongodb");
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'mongodb://127.0.0.1:27017'; // Replace with your MongoDB connection URL
        const client = new mongodb_1.MongoClient(url);
        try {
            yield client.connect();
            console.log('Connected to MongoDB');
            const db = client.db("MAC_BOT"); // Replace with your database name
            return db;
        }
        catch (error) {
            console.error('Error connecting to MongoDB', error);
            throw error;
        }
    });
}
function addProject(proj) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (yield connectToMongoDB()).collection('MAC_BOT_PROJECTS').insertOne({ name: proj });
            console.log('Project inserted:', data.insertedId);
        }
        catch (error) {
            console.error('Error inserting document', error);
            throw error;
        }
    });
}
exports.addProject = addProject;
function listProjectNames() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (yield connectToMongoDB()).collection('MAC_BOT_PROJECTS').find().toArray();
            const arr = [];
            data.forEach(ele => {
                arr.push(ele.name);
            });
            return arr;
        }
        catch (error) {
            console.error('Error inserting document', error);
            throw error;
        }
    });
}
exports.listProjectNames = listProjectNames;
function addUsers(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (yield connectToMongoDB()).collection('MAC_BOT_PROJECTS').insertOne({ name: user });
            console.log('Project inserted:', data.insertedId);
        }
        catch (error) {
            console.error('Error inserting document', error);
            throw error;
        }
    });
}
exports.addUsers = addUsers;
function listUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (yield connectToMongoDB()).collection('MAC_BOT_PROJECTS').find().toArray();
            console.log(data);
            return data;
        }
        catch (error) {
            console.error('Error inserting document', error);
            throw error;
        }
    });
}
exports.listUsers = listUsers;
