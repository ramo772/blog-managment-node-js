# 📝 Node.js Blog API

A fully-featured RESTful API for managing user authentication and blog content using **Express.js**, **MongoDB**, and **JWT**. Includes **Swagger documentation**, **request validation with Joi**, **pagination**, and **extensive test coverage**.

---

## 📚 Table of Contents

- [📝 Node.js Blog API](#-nodejs-blog-api)
  - [📚 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [🛠️ Installation](#️-installation)
  - [⚙️ Configuration](#️-configuration)
  - [📖 API Documentation](#-api-documentation)
  - [📦 Usage](#-usage)
  - [📁 Project Structure](#-project-structure)
  - [🧪 Testing](#-testing)
    - [Tools Used:](#tools-used)
  - [🛠️ Troubleshooting](#️-troubleshooting)
    - [Missing JWT Key Error:](#missing-jwt-key-error)
    - [Database Not Connecting:](#database-not-connecting)
    - [Swagger Not Showing Up:](#swagger-not-showing-up)

---

## 🚀 Features

- **User Authentication**: Secure registration and login with **JWT authentication**.
- **Blog Management**: Full CRUD operations for blogs (Create, Read, Update, Delete).
- **Advanced Filtering**: Category-based filtering and keyword search for blogs.
- **Pagination**: Seamless pagination support using `mongoose-paginate-v2`.
- **Validation**: Centralized request validation with **Joi**.
- **Middleware**: Authentication, error handling, and ID validation.
- **API Documentation**: Swagger UI integration for easy API exploration.
- **Testing**: Comprehensive unit and integration tests with **Jest** and **Supertest**.
- **Scalable Architecture**: Modular folder structure for maintainability and scalability.

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/blog-api.git](https://github.com/ramo772/blog-managment-node-js.git)
   cd blog-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB:
   Ensure MongoDB is installed on your system. Run the following command to start the MongoDB server:
   ```bash
   mongod --dbpath ~/data/db
   ```
   If the `~/data/db` directory does not exist, create it using:
   ```bash
   mkdir -p ~/data/db
   ```
---

## ⚙️ Configuration

1. Create a `default.json` file under the `config/` directory:
   ```json
   {
     "jwtPrivateKey": "your_jwt_private_key",
     "db": "mongodb://localhost/blog-api"
   }
   ```

2. Ensure MongoDB is running locally or update the `db` field with your MongoDB URI.

---

## 📖 API Documentation

Access the Swagger UI for API documentation:

- **URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger documentation is generated using **OpenAPI 3.0** with annotations in the route files.

---

## 📦 Usage

1. Start the server:
   ```bash
   nodemon index.js
   ```

2. The server will run at:
   - **URL**: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
.
├── controllers/        # API logic
├── services/           # Business logic
├── models/             # Mongoose schemas and Joi validations
├── routes/             # Express route handlers
├── middleware/         # Auth, validation, error handling
├── repositories/       # Base and model-specific data access
├── requests/           # Joi validation schemas
├── startup/            # Application setup
├── docs/               # Swagger configuration
├── tests/              # Unit & integration tests
├── config/             # Environment configs
├── index.js            # App entry point
```

---

## 🧪 Testing

Run all unit and integration tests:
```bash
npx jest --detectOpenHandles --forceExit
```

### Tools Used:
- **Jest**: Unit testing framework.
- **Supertest**: HTTP integration testing.
- **MongoDB Memory Server** (optional): For isolated tests.

---

## 🛠️ Troubleshooting

### Missing JWT Key Error:
**Error**: `FATAL ERROR: jwtPrivateKey is not defined.`
- **Solution**: Ensure `jwtPrivateKey` is defined in your `config/default.json`.

### Database Not Connecting:
**Error**: MongoDB connection issues.
- **Solution**: Verify the MongoDB URI in your `config/default.json`.

### Swagger Not Showing Up:
**Error**: Swagger UI is not accessible.
- **Solution**: Ensure route files are correctly picked up by Swagger's `apis` setting.

