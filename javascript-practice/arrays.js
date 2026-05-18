 console.clear();
  
let students=["Fizza","Azfar","Sara","Ahmed"];

console.log(students.length);

//finding a student in the array
let searchedStudent=students.find(function(student){
    return student==="Sara";
}   );

console.log(searchedStudent);   
//finding the index of a student in the array
let searchedStudentIndex=students.findIndex(function(student){
    return student==="Sara";
}   );
console.log(searchedStudentIndex);

//sorting the array
//students.sort();
console.log(students);

//this will remove the student at index 1 and add "abc" in its place
// there are two 1s in the splice method, 
// the first one is the index from where 
// we want to start removing elements and
//  the second one is the number of elements 
// we want to remove. In this case, 
// we are removing 1 element at index 1 
// and adding "abc" in its place.
students.splice(1,1,"abc");
console.log(students);

