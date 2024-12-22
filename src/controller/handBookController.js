import handBookService from "../services/handBookService"

let createNewHandBook = async (req, res) => {
    try {
        let data = await handBookService.createNewHandBook(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getAllHandBook = async (req, res) => {
    try {
        let data = await handBookService.getAllHandBook();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let getInfoHandBookById = async (req, res) => {
    try {
        let data = await handBookService.getInfoHandBookById(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let postSaveInfoHandBook = async (req, res) => {
    try {
        let data = await handBookService.postSaveInfoHandBook(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}

let deleteHandBook = async (req, res) => {
    try {
        let data = await handBookService.deleteHandBook(req.query.id);
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
    createNewHandBook: createNewHandBook,
    getAllHandBook: getAllHandBook,
    getInfoHandBookById: getInfoHandBookById,
    postSaveInfoHandBook: postSaveInfoHandBook,
    deleteHandBook: deleteHandBook
}