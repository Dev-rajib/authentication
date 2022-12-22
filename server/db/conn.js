const mongoose = require('mongoose');

const DB="mongodb+srv://rajib:rajib123@cluster0.2vyy1oo.mongodb.net/mernstack?retryWrites=true&w=majority";

mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log('connection start')).catch((error)=>console.group(error.message));