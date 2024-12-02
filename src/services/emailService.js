require('dotenv').config();

import nodemailer from "nodemailer"

let sendEmail = async (receivers) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Booking Care 👻" <maddison53@ethereal.email>',
        to: receivers.email,
        subject: "Thông Tin Đặt Lịch Khám Bệnh",
        text: `Chào ${receivers.patientName},\n\nCảm ơn bạn đã đặt lịch khám bệnh.\nNgày hẹn của bạn là: ${receivers.date}\nGiờ hẹn: ${receivers.time}\n\nTrân trọng,\nBác sĩ phụ trách ${receivers.doctorName}`,
        html: getBodyHTMLEmail(receivers)

    });
};

let getBodyHTMLEmail = (receivers) => {
    console.log(receivers)
    let result = ``;
    if (receivers.language === 'vi') {
        result =
            `
            <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f9;
                        }
                        .container {
                            width: 100%;
                            max-width: 1200px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                            padding: 20px;
                        }
                        .header {
                            text-align: center;
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            padding: 20px;
                            line-height: 1.6;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 14px;
                            color: #777;
                        }
                        .btn {
                            display: inline-block;
                            margin-top: 10px;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 4px;
                        }
                        .btn:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Thông Tin Đặt Lịch Khám Bệnh</h2>
                        </div>
                        <div class="content">
                            <p>Chào <strong>${receivers.patientName}</strong>,</p>
                            <p>Cảm ơn bạn đã đặt lịch khám bệnh.</p>
                            <p><strong>Ngày hẹn:</strong> ${receivers.date}</p>
                            <p><strong>Giờ hẹn:</strong> ${receivers.time}</p>
                            <p><strong>Bác sĩ phụ trách:</strong> ${receivers.doctorName}</p>
                            <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào <strong>Xác Nhận</strong> dưới đây và hoàn tất thủ tục đặt lịch.</p>
                            <a href="${receivers.redirectLink}" class="btn" target="_blank">Xác Nhận</a>
                        </div>
                        <div class="footer">
                            <p>Xin chân thành cảm ơn!</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    }
    if (receivers.language === 'en') {
        result =
            `
            <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f9;
                        }
                        .container {
                            width: 100%;
                            max-width: 1200px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                            padding: 20px;
                        }
                        .header {
                            text-align: center;
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            padding: 20px;
                            line-height: 1.6;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 14px;
                            color: #777;
                        }
                        .btn {
                            display: inline-block;
                            margin-top: 10px;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 4px;
                        }
                        .btn:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Appointment Information</h2>
                        </div>
                        <div class="content">
                            <p>Dear <strong>${receivers.patientName}</strong>,</p>
                            <p>Thank you for scheduling your appointment.</p>
                            <p><strong>Appointment Date:</strong> ${receivers.date}</p>
                            <p><strong>Appointment Time:</strong> ${receivers.time}</p>
                            <p><strong>Responsible Doctor:</strong> ${receivers.doctorName}</p>
                            <p>If the above information is correct, please click on <strong>Confirm</strong> below to complete the scheduling process.</p>
                            <a href="${receivers.redirectLink}" class="btn" target="_blank">Confirm</a>
                        </div>
                        <div class="footer">
                            <p>Thank you very much!</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    }
    return result;
}

module.exports = {
    sendEmail
}