console.log("Hello world from Node"); 

function greet(name){
    console.log("Hello "+name); 
}
greet("Fizza")
//window object is not available in node js but it is available in browser
//console.log(window);

const names=process.argv[2];
console.log("Hello "+names);

