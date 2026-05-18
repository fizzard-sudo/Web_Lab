console.log("Hello from external JavaScript file!");

var x=6
var y=7
var z=x+y
console.log("The sum of x and y is: " + z);

function sum(a, b) {
    return a + b;
}   

//you can store function in a variables
var mysum=sum
console.log(mysum);


//event driven programming
function buttonclicked(){
    alert("Button was clicked!");
}