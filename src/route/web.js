import express from "express";
import { authenticate, checkRole } from "../middleware/roleMiddleware";
import homecontroller from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import patientController from "../controller/patientController";
import specialtyController from "../controller/specialtyController";
import clinicController from "../controller/clinicController";
import handBookController from "../controller/handBookController";
let router = express.Router();


let initWebRoutes = (app) => {
    router.get('/', homecontroller.getHomePage);
    router.get('/add-user', homecontroller.getAboutPage);
    router.post('/add-user', homecontroller.postCRUD);
    router.get('/display', homecontroller.displayGetCRUD);

    router.get('/edit-user', homecontroller.getEditUser);
    router.post('/update-user', homecontroller.updateUser);

    router.delete('/delete-user', homecontroller.getDeleteUser);

    router.get('/api/get-all-users', authenticate, checkRole(['R1']), userController.hanldeGetAllUsers);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/forgot-password', userController.handleForgotPassword);
    router.post('/api/change-password', userController.handleChangePassword);
    router.post('/api/create-new-user', authenticate, checkRole(['R1']), userController.handleCreateNewUser);
    router.put('/api/edit-user', authenticate, checkRole(['R1']), userController.handleEditUser);
    router.delete('/api/delete-user', authenticate, checkRole(['R1']), userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', authenticate, checkRole(['R1']), doctorController.getAllDoctor);
    router.post('/api/save-info-doctor', authenticate, checkRole(['R1']), doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    router.post('/api/create-schedule-doctor', authenticate, checkRole(['R2', 'R1']), doctorController.createScheduleDoctor);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);
    router.get('/api/get-list-patient-for-doctor', authenticate, checkRole(['R1', 'R2']), doctorController.getListPatientForDoctor);
    router.post('/api/delete-booking-patient', authenticate, checkRole(['R1', 'R2']), doctorController.deleteBookingPatient);
    router.post('/api/send-remedy', authenticate, checkRole(['R1', 'R2']), doctorController.postSendRemedy);


    router.post('/api/patient-book-appoitment', patientController.postBookingAppointment);
    router.post('/api/verify-book-appoitment', patientController.postVerifyBookingAppointment);
    router.get('/api/get-list-booking-for-patient', patientController.getListBookingForPatientByEmail);

    router.post('/api/create-new-specialty', authenticate, checkRole(['R1']), specialtyController.createNewSpecialty);
    router.post('/api/delete-specialty', authenticate, checkRole(['R1',]), specialtyController.deleteSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-info-specialty-by-id', specialtyController.getInfoSpecialtyById);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.post('/api/save-info-specialty', authenticate, checkRole(['R1',]), specialtyController.postSaveInfoSpecialty);

    router.post('/api/create-new-clinic', authenticate, checkRole(['R1']), clinicController.createNewClinic);
    router.post('/api/delete-clinic', authenticate, checkRole(['R1']), clinicController.deleteClinic);
    router.get('/api/get-all-clinic', clinicController.getAllCLinic);
    router.get('/api/get-info-clinic-by-id', clinicController.getInfoClinicById);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.post('/api/save-info-clinic', authenticate, checkRole(['R1',]), clinicController.postSaveInfoClinic);

    router.post('/api/create-new-handbook', authenticate, checkRole(['R1',]), handBookController.createNewHandBook);
    router.get('/api/get-all-handbook', handBookController.getAllHandBook);
    router.get('/api/get-info-handbook-by-id', handBookController.getInfoHandBookById);
    router.post('/api/save-info-handbook', authenticate, checkRole(['R1',]), handBookController.postSaveInfoHandBook);
    router.post('/api/delete-handbook', authenticate, checkRole(['R1']), handBookController.deleteHandBook);
    return app.use("/", router);
}


module.exports = initWebRoutes;