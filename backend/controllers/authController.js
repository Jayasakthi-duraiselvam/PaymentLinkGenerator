const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");



const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        userModel.findUserByEmail(email, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password only if email doesn't exist
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user
            userModel.createUser(name, email, hashedPassword, (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database Error",
                        error: err.message
                    });
                }

                res.status(201).json({
                    message: "User Registered Successfully"
                });

            });

        });

    } catch (error) {

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });

    }

};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Basic Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        // Find user
        userModel.findUserByEmail(email, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            // User not found
            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            // Compare Password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

            const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

res.status(200).json({
    message: "Login Successful",
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email
    }
});

        });

    } catch (error) {

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });

    }

};

const profile = (req, res) => {

    res.json({

        message: "Protected Route Accessed",

        user: req.user

    });

};

module.exports = {
    register,
    login,
    profile
};