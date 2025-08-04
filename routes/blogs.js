const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const validateObjectId = require('../middleware/validateObjectId');
const { createBlogValidation, updateBlogValidation } = require('../requests/blogValidations');
const auth = require('../middleware/auth');
const { createBlog, updateBlog, deleteBlog, getAll, getOne, search, getByCategory } = require('../controllers/blogController');




//getAllBlogs
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blog posts
 *     responses:
 *       200:
 *         description: A list of blog posts
 */
router.get('/', getAll);
/**
 * @swagger
 * /api/blogs/search:
 *   get:
 *     summary: Search blogs by title or content
 *     parameters:
 *       - in: query
 *         name: searchQuery
 *         required: true
 *         schema:
 *           type: string
 *           example: "writting"
 *         description: The search query to filter blogs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of blogs per page
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 */
router.get('/search', search);


/**
 * @swagger
 * /api/blogs/category/{category}:
 *   get:
 *     summary: Get blogs by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category of the blogs to retrieve
 *     responses:
 *       200:
 *         description: Blogs fetched successfully by category
 */
router.get('/category/:category', getByCategory)

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to retrieve
 *     responses:
 *       200:
 *         description: A single blog post
 *       404:
 *         description: Blog post not found
 */
router.get('/:id', [validateObjectId], getOne);

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Blog"
 *               content:
 *                 type: string
 *                 example: "This is the content of my first blog."
 *               category:
 *                 type: string
 *                 example: "Technology"
 *     responses:
 *       200:
 *         description: Blog post created successfully
 *       401:
 *         description: Unauthorized – token missing or invalid
 */
router.post('/', [auth, validateRequest(createBlogValidation)], createBlog);


/** * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update an existing blog post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Blog Title"
 *               content:
 *                 type: string
 *                 example: "This is the updated content of the blog."
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       401:
 *        description: Unauthorized – token missing or invalid
 */
router.put('/:id', [auth, validateRequest(updateBlogValidation), validateObjectId], updateBlog);


/** * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e001c8e4b2a"
 *         description: The ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized – token missing or invalid
 */

router.delete('/:id', [auth, validateObjectId], deleteBlog);


module.exports = router; 
