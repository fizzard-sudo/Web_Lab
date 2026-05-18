//yeh wala binding k liye h
$(function(){
    $("#loadData").click(sendAjax)
})

function sendAjax(){

console.log("Sending ajax request");
//send request here
$.get("students.txt",handleResponse)
console.log("Request sent");

}
function handleResponse(response){
console.log("Response received");
//console.log(response);
//$("#result").empty();
$("#result").append(response);

}