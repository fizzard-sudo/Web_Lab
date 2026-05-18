window.onload=function(){
    var btn=document.getElementById("todobttn");
    btn.onclick=addtodo;
}

function addtodo(){

    var myInput=document.getElementById("myInput");
    var list=document.getElementById("myUL"); 

    var newText=document.createTextNode(myInput.value);
    var newlist=document.createElement("li");

    newlist.appendChild(newText);
    list.appendChild(newlist);
   
}   

function handledelete(e){
    var tag=e.target;
    var li=tag.parentNode;
    li.parentNode.removeChild(li);
}
