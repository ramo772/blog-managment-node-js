const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { registerSchema, loginSchema } = require('../requests/userValidations');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name  
 *               - password
 *             properties:
 *               name:
 *                type: string
 *                example: "Omar Khaled"
 *               email:
 *                 type: string
 *                 example: "omar@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Wesdwesd!@333"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *        description: User already exists
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "omar@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Wesdwesd!@333"
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', validateRequest(loginSchema), login);

module.exports = router; 
