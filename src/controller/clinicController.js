import clinicService from "../services/clinicService"


let createNewClinic = async (req, res) => {
    try {
        let data = await clinicService.createNewClinic(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getAllCLinic = async (req, res) => {
    try {
        let data = await clinicService.getAllCLinic();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        console.log(req.query)
        let data = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let deleteClinic = async (req, res) => {
    try {
        console.log(req.query.id)
        let data = await clinicService.deleteClinic(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getInfoClinicById = async (req, res) => {
    try {
        console.log(req.query.id)
        let data = await clinicService.getInfoClinicById(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let postSaveInfoClinic = async (req, res) => {
    try {
        let data = await clinicService.postSaveInfoClinic(req.body);
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
    createNewClinic: createNewClinic,
    getAllCLinic: getAllCLinic,
    getDetailClinicById: getDetailClinicById,
    deleteClinic: deleteClinic,
    getInfoClinicById: getInfoClinicById,
    postSaveInfoClinic: postSaveInfoClinic
}