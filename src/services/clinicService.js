import db from "../models"


let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.address || !data.clinicName || !data.contentHTML || !data.contentMarkdown || !data.imageBase64) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required fields!',
                });
            }

            await db.Clinic.create({
                name: data.clinicName,
                image: data.imageBase64,
                descriptionHTML: data.contentHTML,
                descriptionMarkdown: data.contentMarkdown,
                address: data.address
            });

            resolve({
                errCode: 0,
                errMessage: 'Ok',
            });
        } catch (error) {
            console.error("Error saving specialty:", error);
            reject({
                errCode: -2,
                errMessage: 'Error saving specialty.',
            });
        }
    });
};

let getAllCLinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data = data.map(item => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                });
                resolve({
                    errCode: 0,
                    errMessage: 'oke',
                    data
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Undefined data specialty',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing Parameter!'
                });
            } else {

                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown'],
                    include: [
                        {
                            model: db.Doctor_Infor,
                            as: 'clinicTypeData',
                            where: { clinicId: inputId, },
                            attributes: ['doctorId']
                        }
                    ],
                    raw: false
                });

                if (!data) {
                    resolve({
                        errCode: -2,
                        errMessage: 'No data found!',
                        data: {}
                    });
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'OK',
                        data: data
                    });
                }
            }
        } catch (error) {
            console.error(error); // Log lỗi để debug
            reject(error);
        }
    });
}
module.exports = {
    createNewClinic: createNewClinic,
    getAllCLinic: getAllCLinic,
    getDetailClinicById: getDetailClinicById
}