import express from "express";
import homecontroller from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import patientController from "../controller/patientController";
let router = express.Router();


let initWebRoutes = (app) => {
    router.get('/', homecontroller.getHomePage);
    router.get('/add-user', homecontroller.getAboutPage);
    router.post('/add-user', homecontroller.postCRUD);
    router.get('/display', homecontroller.displayGetCRUD);

    router.get('/edit-user', homecontroller.getEditUser);
    router.post('/update-user', homecontroller.updateUser);

    router.delete('/delete-user', homecontroller.getDeleteUser);

    router.get('/api/get-all-users', userController.hanldeGetAllUsers);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctor);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    router.post('/api/create-schedule-doctor', doctorController.createScheduleDoctor);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);

    router.post('/api/patient-book-appoitment', patientController.postBookingAppointment);
    return app.use("/", router);
}


module.exports = initWebRoutes;