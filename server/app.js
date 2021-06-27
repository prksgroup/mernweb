const express=require('express')
const app= express();
const mongoose=require('mongoose')
const dotenv=require('dotenv')

dotenv.config({path:'./config/dev.env'})
require('./db/conn');
app.use(express.json())
// require('./router/auth');
const PORT=process.env.Pt || 3000;


app.use(require('./router/auth'))



app.listen(PORT,()=>{
    console.log(`Port is running on ${PORT}`);
})