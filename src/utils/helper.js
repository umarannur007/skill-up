const bcrypt = require("bcrypt")

exports.hashPassword = async(plainPassword) => {
    const saltRounds = 12;

    return await bcrypt.hash(plainPassword, 12)
} 

exports.validateUser = (data) => {
    const errors = [];

    // validate the user data
    if (!data.name || data.name === "") {
        const error = {
            message: "Name is required",
            field: "name"
        }
        errors.push(error);
    }

    if (!data.email || data.email === "") {
        const error = {
            message: "Email is required",
            field: "email"
        }
        errors.push(error);
    }

    if (!data.password || data.password === "") {
        const error = {
            message: "Password is required",
            field: "password"
        }
        errors.push(error);
    } else if (data.password.length < 5) {
        const error = {
            message: "Password must be 5 characters or more",
            field: "password"
        }
        errors.push(error);
    }

    return {errors, data}
}