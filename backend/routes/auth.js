const express = require("express");
const router = express.Router();
const AuthModel = require("../models/authModel.js");
const AuthController = require("../controllers/authController.js");
const jwt = require("jsonwebtoken");
require('dotenv').config();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);
module.exports = router;
