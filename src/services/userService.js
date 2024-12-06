import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import sendEmailForgotPassword from './emailService'

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resole, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resole(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'firstName', 'lastName', 'email', 'roleId', 'password'],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Oke';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Sai mật khẩu!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'Không tìm thấy người dùng!';
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = 'Email không tồn tại trong hệ thống. Vui lòng thử lại!';
            }
            resolve(userData);
        } catch (e) {
            console.error("Lỗi trong handleUserLogin:", e);
            reject(e);
        }
    });
};
let buildUrlEmail = (token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}`;
    return result;
};

let handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = uuidv4();
            if (!data.email) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                });
            }

            // Find the user by email
            let user = await db.User.findOne({
                where: { email: data.email }
            });
            if (user) {

                user.resetToken = token;
                user.resetTokenExpiry = Date.now() + 3600000;
                await user.save();

                // Create the reset password link
                let resetLink = buildUrlEmail(token);

                await sendEmailForgotPassword({
                    email: user.email,
                    redirectLink: resetLink
                });

                resolve({
                    errCode: 0,
                    errMessage: "Password reset email sent successfully."
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User not found"
                });
            }
        } catch (error) {
            console.error('Error in handleForgotPassword:', error);
            reject({
                errCode: -1,
                errMessage: "An error occurred. Please try again later."
            });
        }
    });
};


let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });
            resolve(!!user);
        } catch (e) {
            console.error("Lỗi trong checkUserEmail:", e);
            reject(e);
        }
    });
};


let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } if (userId && userId != 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your Email Is Already Use!!'
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    positionId: data.position,
                    phonenumber: data.phonenumber,
                    roleId: data.role,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    message: 'Cant find User'
                })

            }
            await db.User.destroy({
                where: { id: id }
            })
            resolve({
                errCode: 0,
                message: 'Delete User Success!'
            })

        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
            if (!data.id) {
                resolve({
                    errCode: 4,
                    message: 'Error!!'
                })

            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.gender = data.gender; // Chuyển đổi sang boolean
                user.phonenumber = data.phonenumber;
                user.roleId = data.role;
                user.positionId = data.position;
                user.image = data.avatar;
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update Success!'
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'Update Fail!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter!'
                })
            } else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode
                resolve(res);
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    getAllCodeService,
    handleForgotPassword
};
