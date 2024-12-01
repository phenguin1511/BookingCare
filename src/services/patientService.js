import { where } from "sequelize"
import db from "../models"
import { defaults } from "lodash";
let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing or invalid email parameter!'
                });
            }
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3'
                }
            });
            if (user && user[0]) {
                await db.Booking.findOrCreate({
                    where: { patientId: user[0].id },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType
                    },
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Oke',
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postBookingAppointment: postBookingAppointment,
}