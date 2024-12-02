import { where } from "sequelize"
import db from "../models"
import { defaults } from "lodash";
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = uuidv4();
            if (!data || !data.email) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing or invalid email parameter!',
                    data: data
                });
            }
            console.log(data)
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
                        timeType: data.timeType
                    },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user.id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
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
                        email: 'lehoainguyenphuc11b3@gmail.com',
                        redirectLink: buildUrlEmail(data.doctorId, token),
                        language: data.language
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

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let postVerifyBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing or invalid email parameter!',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment success!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exits'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBookingAppointment
}