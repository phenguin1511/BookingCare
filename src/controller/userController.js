import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing Inputs Parameter!'
        })
    } else {
        let userData = await userService.handleUserLogin(email, password);
        return res.status(200).json({
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : {}

        })
    }
}

let hanldeGetAllUsers = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing Required Parameters',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    console.log(users);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'oke',
        users
    })
}

module.exports = {
    handleLogin: handleLogin,
    hanldeGetAllUsers: hanldeGetAllUsers
}