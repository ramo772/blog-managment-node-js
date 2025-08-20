const { create, updateBlogService, deleteBlogService, getAllBlogs, getBlogByID } = require("../services/blogService")
const { success , error} = require("../helpers/responses");
const STATUS_CODES = require("../helpers/statusCodes");

const getAll = async (req, res) => {
    try {
        
        const response = await getAllBlogs(req.query)
        success(res, response.statusCode,response);
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}

const getOne = async (req, res) => {
    try {
        const response = await getBlogByID(req.params.id)
        success(res, response.statusCode,response);
    } catch (err) {
        console.error(err);
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}
const createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body; 
        const createData = { title, content, category, userId: req.headers['user-id'] }; 
        const response = await create(createData)
        success(res, response.statusCode,response);
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}
const updateBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body; 
        const updateData = { title, content, category, userId: req.headers['user-id'] }; 
        const response = await updateBlogService(req.params.id, updateData)
        success(res, response.statusCode, response);
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}
const deleteBlog = async (req, res) => {
    try {
        const response = await deleteBlogService(req.params.id, req.headers['user-id'])
        success(res, response.statusCode, response );
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}


module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAll,
    getOne,
}