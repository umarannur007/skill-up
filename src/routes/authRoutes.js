const fs = require("fs")
const nanoId = require("nanoid");
const express = require("express");
const bcrypt = require("bcrypt")

const {validateUser, hashPassword} = require("../utils/helper")

const router = express.Router()

const filePath = "./src/db/users.json"

// api/v1/auth

router.post("/signup", async (req, res) => {
    try {
        // get the user to create
        const {errors, data} = validateUser(req.body)        

        // check if there are any validation errors
        if (errors.length > 0) {
            return res.status(422).json({
                success: false,
                errors: {
                    message: "Validation failed",
                    details: errors,
                },
            });
        }

        const { name, email, password } = data;

        // Check if email is already take
        const dbData = fs.readFileSync(filePath)

        const users = JSON.parse(dbData)

        const userIndex = users.findIndex(user => user.email === email)

        // chaek if the email isn't already take
        if(userIndex !== -1){
            const error = {
                message: `Email "${email}" is already taken, use a different one`,
                field: "email"
            }
            return res.status(400).json({
                success: false,
                errors: {
                    message: "Validation failed",
                    details: [error],
                },
            });
        }

        const hashedPassword = await hashPassword(password);

        // save the user to db
        const newUser = {
            id: nanoId(),
            name,
            email,
            password: hashedPassword 
        }

        users.push(newUser)

        fs.writeFileSync(filePath, JSON.stringify(users))

        // return success response if user creation is successful
        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            errors: {
                message: "Something went wrong",
            },
        });
    }
});

router.post("/login", async (req, res) => {
   try{
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
        res.status(400).json({
            success: false,
            errors: [
                {
                    message: 'Please provide email and password!'
                }
            ]
        })
    }

    // Check if email is registerd
    const dbData = fs.readFileSync(filePath)

    const users = JSON.parse(dbData)

    const userIndex = users.findIndex(user => user.email === email)

    if(userIndex === -1){
        const error = {
            message: `Email "${email}" is not registers, pls signup`,
            field: "email"
        }
        return res.status(400).json({
            success: false,
            errors: {
                message: "Validation failed",
                details: [error],
            },
        });
    }

    const user = users[userIndex]

    const isPasswordCorrect = await bcrypt.compare(password, user.password) 

    if(!isPasswordCorrect){
        const error = {
            message: `Password is wrong`,
            field: "password"
        }
        return res.status(400).json({
            success: false,
            errors: {
                message: "Validation failed",
                details: [error],
            },
        });
    }

    // Log userin and return an access token
    return res.status(200).json({
        success: true,
        message: "User Login successfully",
    });

   }catch (e) {
    console.log(e);
    return res.status(500).json({
        success: false,
        errors: {
            message: "Something went wrong",
        },
    });
}
})


module.exports = router