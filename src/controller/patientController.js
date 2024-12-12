import patientService from "../services/patientService";



let postBookingAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookingAppointment(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let postVerifyBookingAppointment = async (req, res) => {
    try {
        let data = await patientService.postVerifyBookingAppointment(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getListBookingForPatientByEmail = async (req, res) => {
    try {
        console.log(req.query.email)
        let data = await patientService.getListBookingForPatientByEmail(req.query.email);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    postVerifyBookingAppointment: postVerifyBookingAppointment,
    getListBookingForPatientByEmail: getListBookingForPatientByEmail
}