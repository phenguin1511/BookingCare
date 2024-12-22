import { where } from "sequelize"
import db from "../models"
import { defaults } from "lodash";
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = uuidv4();
            if (!data || !data.email || !data.doctorId || !data.timeType
                || !data.date || !data.fullName || !data.gender || !data.reason || !data.address) {
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
                    roleId: 'R3',
                    address: data.address,
                    gender: data.gender,
                    lastName: data.fullName
                }
            });

            if (user) {
                // Tìm hoặc tạo lịch hẹn
                let [booking, bookingCreated] = await db.Booking.findOrCreate({
                    where: {
                        // patientId: user.id,
                        timeType: data.timeType,
                        date: data.date,
                        doctorId: data.doctorId
                    },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user.id,
                        date: data.date,
                        timeType: data.timeType,
                        reason: data.reason,
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
                        email: data.email,
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

let getListBookingForPatientByEmail = (email) => {
    console.log(email)
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter!'
                })
            } else {
                let data = await db.User.findAll({
                    where: {
                        email: email,
                        roleId: 'R3'
                    },
                    attributes: ['firstName', 'lastName'],
                    include: [
                        {
                            model: db.Booking, as: 'patientData', attributes: ['date', 'timeType', 'statusId', 'doctorId'],
                            include: [
                                // { model: db.Allcode, as: 'dateTypeDataPatient', attributes: ['valueEn', 'valueVn'] },
                                { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVn'] },
                                { model: db.Allcode, as: 'statusTypeDataPatient', attributes: ['valueEn', 'valueVn'] },
                                { model: db.User, as: 'doctorDataBooking', attributes: ['firstName', 'lastName'] },
                            ]
                        },

                    ],
                    raw: false
                })
                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Data not found!'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Oke',
                        data
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
    postVerifyBookingAppointment,
    getListBookingForPatientByEmail
}