const express = require("express");

const app = express();


app.get("/", (req, res) => {
    res.send("<h2>Welcome to skill up 23<h2>")
});


const posts = [
    {
        id: 2,
        title: "some cool title",
        content: "some very long contentlsd;lsd;lsd sd;lsd;l"
    },
    {
        id: 3,
        title: "some cool title 2",
        content: "some very long conten djksdjkd"
    }
]



app.get("/api/v1/posts", (req, res) => {
    
    console.log(posts)

    res.json(posts)
})

app.get("/api/v1/posts/:postId", (req, res) => {
    const postId = req.params.postId
    
    const parsedPostId = parseInt(postId)

    const postIndex = posts.findIndex((post) => post.id === parsedPostId);

    if(postIndex === -1) {
        return res.status(404).json({
            error: true,
            message: "Post not found"
        })
    }

    const post = posts[postIndex]

    res.json(post)
})


app.listen(5000, () => {
    console.log("Server is run on port 5000")
});