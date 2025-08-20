const { log } = require("winston");
const STATUS_CODES = require("../helpers/statusCodes");
const blogRepository = require("../repositories/blogRepository");
const userRepository = require("../repositories/userRepository");
const _ = require('lodash');

const getAllBlogs = async (queryParams = {}) => {
    try {
        const { page, limit, searchQuery, category } = queryParams ;

        const filter = {};
        if (searchQuery) {
            filter.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        if (category) {
            filter.category = category;
        }

        const blogs = await blogRepository.getAllWith(['userId'], true, filter, { page, limit });
        
        const {  ...paginationWithoutDocs } = blogs;

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

const create = async (blogData) => {
    try {
        const user = await userRepository.findById(blogData.userId);
        if (!user) return {
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "User not found."
        };
        let blog = await blogRepository.create({
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
            return {
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: "Blog does not belong to the user."
            };
        }
        let updatedBlog = await blogRepository.update(id, data)
        if (!updatedBlog) throw new Error("Error updating blog.");
        updatedBlog = await blogRepository.findById(id);

        return {
            updatedBlog: _.pick(updatedBlog, ['_id', 'title', 'content', 'category']),
            statusCode: STATUS_CODES.OK,
            message: "Blog updated successfully."
        }

    } catch (err) {
        console.log(err);
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
}