let http=require("http");
const { url } = require("inspector");
let server=http.createServer(function(req,res){  
    if(req/url=="/")return res.end("hello from server");
    if(req/url=="/about")return res.end("about us");
    return res.end("page not found");
});
server.listen(3000,function(){
    console.log("server is running on port 3000");
});