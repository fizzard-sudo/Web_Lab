let express=require("express");
let app=express();

app.set("view engine","ejs");   
app.use(express.static("public"));
app.get("/",function(req,res){
    return res.send("homeepage");

});

app.listen(3000,function(){
    console.log("server is running on port 3000");
});
console.log("console from express.js files")