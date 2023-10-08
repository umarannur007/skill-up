const fs = require("fs")

const express = require("express");
const nanoId = require("nanoid");


const app = express();

const filePath = "./data.json"

//Create data.json file automaticly
// fs.writeFile("data.json", JSON.stringify([]), (err) => {
//     if(err){
//         console.log("data file createion failed")
//     }
//     else{
//         console.log("data.jsonj file created successfully")
//     }
// })

// parse incomming request body if urlencoded or json
app.use(express.json());
app.use(express.urlencoded({extended: true})) 

app.use((req, res, next) => {
    console.log("ran the middleware")

    next()
})


//TODO: add View engin

app.get("/", (req, res) => {
    res.send("<h2>Welcome to skill up 23<h2>")
});

//CRUD

app.get("/api/v1/posts", (req, res) => {
    
    fs.readFile(filePath, (err, data) => {
        if(err) return Error("Error reading data file")
        const posts = JSON.parse(data)

        res.json({
            success: true,
            posts
        })
    })
    
})

app.get("/api/v1/posts/:postId", (req, res) => {
    const postId = req.params.postId
    
    fs.readFile(filePath, (err, data) => {
        if(err) return Error("Error reading data file")

        const posts = JSON.parse(data)

        const post = posts.find((post) => post.id === postId);

        if(!post) {
            return res.status(404).json({
                error: true,
                message: "Post not found"
            })
        }

        res.json({
            success: true,
            post
        })


    })

})

app.post("/api/v1/posts", (req, res) => {
    const {title, content} = req.body

    if(!title){
        return res.status(401).json({
            success: false,
            error: "title is required"
        })
    }
    if(!content){
        return res.status(401).json({
            success: false,
            error: "content is required"
        })
    }

    const post = {
        id: nanoId(),
        title,
        content   
    }

    fs.readFile(filePath, (err, data) => {
        if(err) return res.status(500).json({error: "internal server error"})

        const posts = JSON.parse(data)

        posts.push(post)

        fs.writeFile(filePath, JSON.stringify(posts), err => {
            console.log(err)
            return res.status(500).json({error: "internal server error"})
        })


        res.json({
            success: true,
            post
        })

    })
   
})

// TODO: UPDATE post

app.delete("/api/v1/posts/:postId", (req, res) => {
    const postId = req.params.postId

    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log(err)
            return res.status(500).json({error: "internal server error"})
        }

        const posts = JSON.parse(data);

        const postIndex = posts.findIndex((post) => post.id === postId);

        posts.splice(postIndex, 1);

        fs.writeFile(filePath, JSON.stringify(posts), err => {
            console.log(err)
            return res.status(500).json({error: "internal server error"})
        });

    
        //return to user success

        res.json({
            success: true,
            message: "post deleted successfully"
        })
    })

})

app.listen(5000, () => {
    console.log("Server is run on port 5000")
});