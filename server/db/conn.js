const mongoose=require('mongoose')
const db=process.env.DB;

mongoose.connect(db,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log("Error occurred while connecting to database ",err)
})