import { includes } from "lodash";
import db from "../models"
import { where } from "sequelize";


let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.specialtyName || !data.contentHTML || !data.contentMarkdown || !data.imageBase64) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required fields!',
                });
            }

            await db.Specialty.create({
                name: data.specialtyName,
                image: data.imageBase64,
                descriptionHTML: data.contentHTML,
                descriptionMarkdown: data.contentMarkdown,
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

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            console.log(data);
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

let getDetailSpecialtyById = (inputId, inputLocation) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !inputLocation) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing Parameter!'
                });
            } else {
                let whereClause = {};
                if (inputLocation !== 'ALL') {
                    whereClause.provinceId = inputLocation;
                }

                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown'],
                    include: [
                        {
                            model: db.Doctor_Infor,
                            as: 'specialtyTypeData',
                            where: { specialtyId: inputId, ...whereClause }, // Kết hợp các điều kiện
                            attributes: ['doctorId', 'provinceId']
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
};


let deleteSpecialty = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing Parameter!',
                });
            } else {
                console.log(`Attempting to delete specialty with ID: ${inputId}`);
                let specialty = await db.Specialty.findOne({
                    where: { id: inputId },
                });

                if (!specialty) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Specialty not found!',
                    });
                } else {
                    await db.Specialty.destroy({
                        where: { id: inputId },
                    });
                    console.log(`Specialty with ID: ${inputId} deleted successfully.`);
                    resolve({
                        errCode: 0,
                        errMessage: 'Delete successful!',
                    });
                }
            }
        } catch (error) {
            console.error('Error during delete:', error);
            reject(error);
        }
    });
};


module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialty: deleteSpecialty
}