const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/inotebook',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connectTomongo=async ()=>{
    try{
    console.log("connected to mongoose successfully");
    }catch(error){
        console.log("connection failed");
    }
}
module.exports=connectTomongo;