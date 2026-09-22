const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({
            username: username
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true,
            message: "Account created successfully!"
        });

    } catch (error) {
        console.log("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username not found."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        res.json({
            success: true,
            message: "Login successful!"
        });

    } catch (error) {
        console.log("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

module.exports = app;