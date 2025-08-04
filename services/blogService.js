const { log } = require("winston");
const STATUS_CODES = require("../helpers/statusCodes");
const blogRepository = require("../repositories/blogRepository");
const userRepository = require("../repositories/userRepository");
const _ = require('lodash');
const e = require("express");

const getAllBlogs = async (paginationData) => {
    try {
        const { page, limit } = paginationData || { page: 1, limit: 10 };
        const blogs = await blogRepository.getAllWith(['userId'], true, {}, { page, limit });
        const { docs, ...paginationWithoutDocs } = blogs;

        return {
            blogs: { docs: blogs.docs.map(blog => _.pick(blog, ['_id', 'title', 'content', 'category', 'userId.name'])), },
            pagination: paginationWithoutDocs,
            statusCode: STATUS_CODES.OK,
            message: "All Blogs Fetched successfully."
        }
    } catch (err) {
        log('error', `Error fetching blogs: ${err.message}`);
        throw new Error("Error fetching blog.");
    }
}

const searchBlogs = async (searchQuery, paginationData) => {
    try {
        const { page, limit } = paginationData || { page: 1, limit: 10 };
        const filter = {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        const blogs = await blogRepository.getAllWith(['userId'], true, filter, { page, limit });
        const { docs, ...paginationWithoutDocs } = blogs;

        return {
            blog: { docs: blogs.docs.map(blog => _.pick(blog, ['_id', 'title', 'content', 'category', 'userId.name'])), },
            pagination: paginationWithoutDocs,
            statusCode: STATUS_CODES.OK,
            message: "Blogs fetched successfully."
        };
    } catch (err) {
        log('error', `Error searching blogs: ${err.message}`);
        throw new Error("Error searching blogs.");
    }
};



const getBlogByID = async (blogID) => {
    try {

        const blog = await blogRepository.findOneWith(blogID, ['userId']);
        if (!blog) return {
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Blog not found."
        };
        return {
            blog: _.pick(blog, ['_id', 'title', 'content', 'category', 'userId.name']),
            statusCode: STATUS_CODES.OK,
            message: "Blog Fetched successfully."
        }


    } catch (err) {
        log('error', `Error fetching blog: ${err.message}`);

        throw new Error("Error fetching blog.");
    }
}
const getBlogsByCategory = async (category, paginationData) => {
    try {

        const { page, limit } = paginationData || { page: 1, limit: 10 };
        const blogs = await blogRepository.getAllWith(['userId'], true, {}, { page, limit });
        const { docs, ...paginationWithoutDocs } = blogs;

        return {
            blogs: { docs: blogs.docs.map(blog => _.pick(blog, ['_id', 'title', 'content', 'category', 'userId.name'])), },
            statusCode: STATUS_CODES.OK,
            pagination: paginationWithoutDocs,
            message: "Blog Fetched successfully."
        }


    } catch (err) {
        log('error', `Error fetching blog: ${err.message}`);

        throw new Error("Error fetching blog.");
    }
}

const create = async (blogData) => {
    try {
        user = await userRepository.findById(blogData.userId);
        if (!user) return{
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "User not found."
        };
        blog = await blogRepository.create({
            title: blogData.title,
            content: blogData.content,
            category: blogData.category,
            userId: user._id
        })
        return {
            blog: _.pick(blog, ['_id', 'title', 'content', 'category']),
            statusCode: STATUS_CODES.CREATED,
            message: "Blog created successfully."
        }


    } catch (err) {
        log('error', `Error creating blog: ${err.message}`);
        throw new Error(`Error creating blog. ${err.message}`);
    }
}
const update = async (id, data) => {
    try {
        const blog = await blogRepository.findById(id);
        if (!blog) return {
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Blog not found."
        };
         if (data.userId !== blog.userId.toString()) {
            if (!user) throw new Error("Blog does not belong to the user.");
        }
        updatedBlog = await blogRepository.update(id, {
            title: data.title,
            content: data.content,
            category: data.category
        })
        if (!updatedBlog) throw new Error("Error updating blog.");
        updatedBlog = await blogRepository.findById(id);

        return {
            updatedBlog: _.pick(updatedBlog, ['_id', 'title', 'content', 'category']),
            statusCode: STATUS_CODES.OK,
            message: "Blog updated successfully."
        }

    } catch (err) {
        log('error', `Error updating blog: ${err.message}`);
        throw new Error("Error updating blog.");
    }

}


const deleteBlog = async (id, userID) => {
    try {

        const blog = await blogRepository.findById(id);
        if (!blog) return {
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Blog not found."
        };
        if (userID !== blog.userId.toString()) {
            throw new Error("Blog does not belong to the user.");
        }

        const deletedBlog = await blogRepository.delete(id);
        if (!deletedBlog) throw new Error("Error deleting blog.");

        return {
            message: "Blog deleted successfully.",
            statusCode: STATUS_CODES.OK
        }
    } catch (err) {
        log('error', `Error deleting blog: ${err.message}`);
        throw new Error("Error deleting blog.");
    }
}


module.exports = {
    create,
    updateBlogService: update,
    deleteBlogService: deleteBlog,
    getAllBlogs,
    getBlogByID,
    searchBlogs,
    getBlogsByCategory
}