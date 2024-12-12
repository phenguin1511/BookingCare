import specialtyService from "../services/specialtyService";




let createNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}
let deleteSpecialty = async (req, res) => {
    try {
        console.log(req.query.id)
        let data = await specialtyService.deleteSpecialty(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialty();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        console.log(req.query)
        let data = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getInfoSpecialtyById = async (req, res) => {
    try {
        console.log(req.query)
        let data = await specialtyService.getInfoSpecialtyById(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let postSaveInfoSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.postSaveInfoSpecialty(req.body);
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
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialty: deleteSpecialty,
    getInfoSpecialtyById: getInfoSpecialtyById,
    postSaveInfoSpecialty: postSaveInfoSpecialty
}