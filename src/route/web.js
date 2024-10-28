import express from "express";
import homecontroller from "../controller/homeController";

let router = express.Router();


let initWebRoutes = (app) => {
    router.get('/', homecontroller.getHomePage);
    router.get('/add-user', homecontroller.getAboutPage);
    router.post('/add-user', homecontroller.postCRUD);
    router.get('/display', homecontroller.displayGetCRUD);

    router.get('/edit-user', homecontroller.getEditUser);
    router.post('/update-user', homecontroller.updateUser);

    router.get('/delete-user', homecontroller.getDeleteUser);
    return app.use("/", router);
}


module.exports = initWebRoutes;