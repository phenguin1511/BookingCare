import { where } from "sequelize"
import db from "../models"
import { raw } from "body-parser"
import _, { includes, reject } from "lodash"
require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVn'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVn'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let saveInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedProvince || !inputData.selectedPayment || !inputData.nameClinic || !inputData.addressClinic || !inputData.note) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                });
            } else {
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML,
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown,
                            doctorMarkdown.description = inputData.description,
                            await doctorMarkdown.save();
                    }
                }

                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {
                    doctorInfor.doctorId = inputData.doctorId,
                        doctorInfor.priceId = inputData.selectedPrice,
                        doctorInfor.provinceId = inputData.selectedProvince,
                        doctorInfor.paymentId = inputData.selectedPayment,
                        doctorInfor.adressClinic = inputData.addressClinic,
                        doctorInfor.nameClinic = inputData.nameClinic,
                        doctorInfor.note = inputData.note,
                        await doctorInfor.save()
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceIdId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        adressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save Doctor Success!!"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing Required Parameter!'
                });
            }
            let data = await db.User.findOne({
                where: {
                    id: inputId,
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['contentHTML', 'contentMarkdown', 'description']
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVn'] },

                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVn'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVn'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVn'] },
                        ]
                    },

                ],
                raw: false,
                nest: true
            });
            if (!data) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Doctor not found!'
                });
            }
            if (data.image) {
                data.image = Buffer.from(data.image, 'base64').toString('binary');
            }
            resolve({
                errCode: 0,
                data: data
            });
        } catch (error) {
            reject(error);
        }
    });
};

let createScheduleDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter!"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formattedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameters"
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVn'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {
                    data = [];
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameters"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVn'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVn'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVn'] },
                    ],
                    raw: false,
                })
                if (!data) data = {}
                resolve({
                    data: data,
                    errCode: 0,
                    errMessage: "Ok"
                })


            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctor: getDetailDoctor,
    createScheduleDoctor: createScheduleDoctor,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById
}