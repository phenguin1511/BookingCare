import db from "../models/index";
import CRUDService from "../services/CRUDService";



let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }

}

let getAboutPage = (req, res) => {
    return res.render('test/addUser.ejs');
}

let postCRUD = async (req, res) => {
    let messsage = await CRUDService.createNewUser(req.body);
    return res.send('POST CRUD from Server')
}

let displayGetCRUD = async (req, res) => {
    let users = await CRUDService.getAllUser();
    return res.render('test/displayUser.ejs', {
        dataTable: users,
    });
}


let getEditUser = async (req, res) => {
    try {
        const userId = req.query.id;
        if (userId) {
            let userData = await CRUDService.getUserInfoById(userId);
            return res.render('test/editUser.ejs', {
                user: userData
            });
        } else {
            return res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
}

let updateUser = async (req, res) => {
    try {
        let data = req.body;
        await CRUDService.putUpdateUser(data);
        return res.redirect('/display'); // Thay đổi sang '/display' để điều hướng đến trang hiển thị người dùng
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating user');
    }
}


let getDeleteUser = async (req, res) => {
    try {
        let data = req.query.id;

        if (data) {
            await CRUDService.deleteUserById(data);
            return res.redirect('/display')
        } else {
            return res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditUser: getEditUser,
    updateUser: updateUser,
    getDeleteUser: getDeleteUser
}