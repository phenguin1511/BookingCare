import bcrypt from 'bcryptjs';
import db from '../models/index'
import { raw } from 'body-parser';
import { where } from 'sequelize';



const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resole, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                phonenumber: data.phonenumber,
                roleId: data.roleId,
            })
            resole('Oke Create Susscess!');
        } catch (e) {
            reject(e);
        }
    })

}

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

let getAllUser = () => {
    return new Promise(async (resole, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resole(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            if (user) {
                resole(user)
            } else {
                resole([])
            }
        } catch (e) {
            reject(e);
        }
    })
}

let putUpdateUser = (data) => {
    return new Promise(async (resole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.gender = data.gender === 'true'; // Chuyển đổi sang boolean
                user.phonenumber = data.phonenumber;
                user.roleId = data.roleId;
                await user.save();
                resole(user);
            }

        } catch (e) {
            reject(e)
        }
    })

}

let deleteUserById = (data) => {
    return new Promise(async (resole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data }
            });
            if (user) {
                await user.destroy();
                resole();
            }
        } catch (error) {
            reject(error);
        }
    })
}




module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    putUpdateUser: putUpdateUser,
    deleteUserById: deleteUserById
}