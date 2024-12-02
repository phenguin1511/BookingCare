import { includes } from "lodash";
import db from "../models"


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

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty
}