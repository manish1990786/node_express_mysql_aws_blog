require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

const postsRoute = require('./routes/posts');
const userRoute = require('./routes/user');
const commentsRoute = require('./routes/comments');
const errorHandler = require("./utils/errorHandler");
const app = express();

app.use(bodyParser.json());
   
app.use("/posts", postsRoute);
app.use("/user", userRoute);
app.use("/comments", commentsRoute);

app.all("*", (req, res, next) => {
    let error = new Error(`The URL ${req.originalUrl} does not exists`)
    error.statusCode = 404
    throw error
});

app.use(errorHandler);

const PORT = process.env.PORT || 3501;

app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}....`);
})