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
module.exports = {
    createNewClinic: createNewClinic,
    getAllCLinic: getAllCLinic
}