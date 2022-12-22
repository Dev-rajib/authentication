const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const router = require('./routes/router');
app.use(cors() );
app.use(express.json());
app.use(cookieParser());
app.use(router);


const port =8009;
require("./db/conn");


// app.get('/', (req,res)=>{
//     res.status(201).json("server created");
// })

app.listen(port,()=>{
    console.log(`server is running port number ${port}`);
});