import { includes, reject } from "lodash";
import db from "../models"
import { Model, where } from "sequelize";


let createNewHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.titleHandBook || !data.child_title || !data.contentHTML || !data.contentMarkdown || !data.imageBase64) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required fields!',
                });
            }

            // Save to the database
            await db.HandBook.create({
                title: data.titleHandBook,
                child_title: data.child_title,
                image: data.imageBase64,
                descriptionHTML: data.contentHTML,
                descriptionMarkdown: data.contentMarkdown,
            });

            resolve({
                errCode: 0,
                errMessage: 'HandBook created successfully!',
            });
        } catch (error) {
            console.error("Error saving handbook:", error);
            reject({
                errCode: -2,
                errMessage: 'Error saving handbook.',
            });
        }
    });
};


let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll();
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
            reject(error)
        }
    })
}

let getInfoHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter!'
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: { id: inputId },
                    raw: false
                });

                if (!data) {
                    resolve({
                        errCode: -2,
                        errMessage: 'No data found!',
                        data: {}
                    });
                } else {
                    if (data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'OK',
                        data: data
                    });
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let postSaveInfoHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.contentHTML || !data.contentMarkdown || !data.image || !data.title || !data.child_title) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required fields!',
                });
            } else {
                let handbook = await db.HandBook.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (!handbook) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Specialty not found!',
                    });
                } else {
                    handbook.title = data.title;
                    handbook.child_title = data.child_title;
                    handbook.image = data.image;
                    handbook.descriptionHTML = data.contentHTML;
                    handbook.descriptionMarkdown = data.contentMarkdown;

                    await handbook.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update successful!',
                    });
                }
            }
        } catch (error) {
            console.error('Error in postSaveInfoHandBook:', error);
            reject({
                errCode: -2,
                errMessage: 'Error updating handbook.',
            });
        }
    });
}
module.exports = {
    createNewHandBook: createNewHandBook,
    getAllHandBook: getAllHandBook,
    getInfoHandBookById: getInfoHandBookById,
    postSaveInfoHandBook: postSaveInfoHandBook
}