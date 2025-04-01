import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
require('dotenv').config();

let app = express();


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


viewEngine(app);


initWebRoutes(app);


connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log("Backend Node.js is running on the port: " + port);
});
