import { where } from "sequelize"
import db from "../models"
import { defaults } from "lodash";
import emailService from './emailService'

let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing or invalid email parameter!',
                    data: data
                });
            }
            console.log(data)
            await emailService.sendEmail({
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                date: data.dateString,
                email: data.email,
                language: data.language
            });
            let [user, userCreated] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3'
                }
            });

            if (user) {
                // Tìm hoặc tạo lịch hẹn
                let [booking, bookingCreated] = await db.Booking.findOrCreate({
                    where: {
                        patientId: user.id,
                        date: data.date
                    },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user.id,
                        date: data.date,
                        timeType: data.timeType
                    }
                });
                if (bookingCreated) {
                    resolve({
                        errCode: 1, // Lịch hẹn mới được tạo
                        errMessage: 'Appointment successfully created!',

                    });
                    await emailService.sendEmail({
                        patientName: data.fullName,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        date: data.dateString,
                        email: 'lehoainguyenphuc11b3@gmail.com'
                    });
                } else {
                    resolve({
                        errCode: 0, // Lịch hẹn đã tồn tại
                        errMessage: 'Appointment already exists!',
                    });
                }
            }
        } catch (error) {
            reject(error); // Bắt lỗi và trả về qua reject
        }
    });
};

module.exports = {
    postBookingAppointment: postBookingAppointment,
}