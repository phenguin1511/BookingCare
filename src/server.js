import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
require('dotenv').config();

let app = express();

// Middleware để phân tích cú pháp body của yêu cầu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: true, // Địa chỉ của client (React app)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    credentials: true // Nếu bạn cần gửi cookie
}));

// Thiết lập view engine
viewEngine(app);

// Khởi tạo các route
initWebRoutes(app);

// Kết nối đến cơ sở dữ liệu
connectDB();

let port = process.env.PORT || 6969;

// Khởi động server
app.listen(port, () => {
    console.log("Backend Node.js is running on the port: " + port);
});
