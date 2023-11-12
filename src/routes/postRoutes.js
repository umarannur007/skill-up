const fs = require("fs")
const nanoId = require("nanoid");

const express = require("express")

const router = express.Router()

const filePath = "./src/db/posts.json"


router.get("/", (req, res) => {
    
    fs.readFile(filePath, (err, data) => {
        if(err) {
            console.log(err)
            return res.status(500).json({error: "internal server error"})
        }
        const posts = JSON.parse(data)

        res.json({
            success: true,
            postCount: posts.length, 
            posts
        })
    })
    
})

router.get("/:postId", (req, res) => {
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

router.post("/", (req, res) => {
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
router.patch("/:postId", (req, res) => {
    const postId = req.params.postId
    // const title = req.body.title
    // const content = req.body.content
    const {title, content} = req.body

    //Read all the post from DB FIle
    const data = fs.readFileSync(filePath)

    const posts = JSON.parse(data)

    //Find the index of the post to change
    const postIndex = posts.findIndex(post => post.id === postId)

    const post = posts[postIndex];

    if(!post) {
        return res.status(404).json({
            error: true,
            message: "Post not found"
        })
    }

    // Updat the post 

    const newPost = {
        ...post,
        title: title ? title : post.title,
        content: content ? content : post.content,
    }

    //save post back to DB
    posts[postIndex] = newPost

    fs.writeFileSync(filePath, JSON.stringify(posts))

    //send user a response

    res.json({
        success: true,
        newPost
    })
})

router.delete("/:postId", (req, res) => {
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

module.exports = router