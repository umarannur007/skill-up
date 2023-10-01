// arrow function

const greet = (name, cb) => {
    console.log("Name")
    cb()
}

function sayGoodBye(){
    console.log("say good bye")
}

greet("Moses", sayGoodBye);


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

posts.findIndex((post) => post.id === 3)


// const testArray = [2,3,4,5,6,7]

// testArray.findIndex((num) => num === 5)