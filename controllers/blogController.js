const c = require("config")
const { create, updateBlogService, deleteBlogService, getAllBlogs, getBlogByID, searchBlogs, getBlogsByCategory } = require("../services/blogService")
const _ = require('lodash');
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

const getByCategory = async (req, res) => {
    try {
        const response = await getBlogsByCategory(req.params.category);

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
        const response = await create(req.body)
        success(res, response.statusCode,response);
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}
const updateBlog = async (req, res) => {
    try {
        const response = await updateBlogService(req.params.id, req.body)
        success(res, response.statusCode, response);
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}
const deleteBlog = async (req, res) => {
    try {
        const response = await deleteBlogService(req.params.id, req.body.userId)
        success(res, response.statusCode, response );
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }

}
const search = async (req, res) => {
    try {
        const { searchQuery, page, limit } = req.query; 
        const response = await searchBlogs(searchQuery, { page, limit });
        return success(res, response.statusCode, response);
    } catch (err) {
        return error(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
    }
};

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAll,
    getOne,
    search,
    getByCategory
}