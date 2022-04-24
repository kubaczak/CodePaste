const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const postRouter = require('./routers/post');
const authRouter = require("./routers/auth")

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.use('/auth', authRouter)
app.use('/post', postRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});