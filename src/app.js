const express = require("express");

const postRoutes = require("./routes/postRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express();

// parse incomming request body if urlencoded or json
app.use(express.json());
app.use(express.urlencoded({extended: true})) 

app.use((req, res, next) => {
    console.log("ran the middleware")

    next()
})


app.get("/", (req, res) => {
    res.send("<h2>Welcome to skill up 23<h2>")
});

//Routes
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/auth", authRoutes)

app.use("*", (req, res) => {
    res.status(404).json({
        status: "fail",
        message: "Page not found"
    })
})

module.exports = app