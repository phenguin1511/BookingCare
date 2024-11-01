import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcryptjs';

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
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

module.exports = {
    handleUserLogin,
    checkUserEmail
};
