// sortscript.js
// Simple plain-JavaScript function to sort the list items inside the #students element.
// This file contains a single handler function that reads the list, sorts the text values,
// and rebuilds the list in sorted order.


function sortBtnHandler(){

  console.log("Sorting......");
  var list=document.getElementById("students");
  var items=list.getElementsByTagName("li");
  var itemsArr=[];
  for(let i=0;i<items.length;i++){
    itemsArr.push(items[i].innerText);
  }
  console.log(itemsArr);
  itemsArr.sort();
  console.log(itemsArr);

  //clear the list
  list.innerHTML="";

  for(let i=0;i<itemsArr.length;i++){

    var li=document.createElement("li");
    li.innerText=itemsArr[i];
    list.appendChild(li);


}
}

function bindings() {
  var btn = document.getElementById("btnSort");
     btn.onclick=sortBtnHandler;
     
 /* if (btn) {
    btn.addEventListener("click", sortBtnHandler);
    console.log("Bound #btnSort click to sortBtnHandler");
  } else {
    console.warn("#btnSort not found - could not bind sortBtnHandler");
  }*/

 
}

// Assign the named bindings function to run when the page has fully loaded
window.onload = bindings;
