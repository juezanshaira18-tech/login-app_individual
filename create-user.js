require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const username = "shaira";
        const password = "shairacaballerojuezan123.";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: username,
            password: hashedPassword
        });

        await user.save();

        console.log("User created successfully!");
        console.log("Username:", username);
        console.log("Password:", password);

        await mongoose.connection.close();

    } catch (error) {
        console.log("Error creating user:", error);
    }
}

createUser();