import userService from "../services/userService";
import jwt from 'jsonwebtoken';
require('dotenv').config();

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing Inputs Parameter!'
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    if (userData.errCode === 0) {
        const token = jwt.sign(
            {
                id: userData.user.id,
                email: userData.user.email,
                role: userData.user.roleId
            },
            process.env.KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            errCode: 0,
            message: 'Login successful!',
            token: token,
            user: userData.user
        });
    }

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage
    });
};


let handleForgotPassword = async (req, res) => {
    try {
        let data = await userService.handleForgotPassword(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let handleChangePassword = async (req, res) => {
    try {
        const response = await userService.handleChangePassword(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in handleChangePassword controller:', error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Internal server error',
        });
    }
};

let postVerifyPasswordUser = async (req, res) => {
    try {
        let data = await userService.postVerifyPasswordUser(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let hanldeGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing Required Parameters',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'oke',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body
    if (!data) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required!'
        })
    }
    let message = await userService.updateUserData(data);

    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Cant find ID!'
        })
    }
    let message = await userService.deleteUser(id);
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data);

    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server!"
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    hanldeGetAllUsers: hanldeGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleForgotPassword: handleForgotPassword,
    postVerifyPasswordUser: postVerifyPasswordUser,
    handleChangePassword: handleChangePassword
}