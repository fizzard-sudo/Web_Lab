// formscript.js
// Dynamically bind the form submit event, validate input, and highlight invalid fields.

function validateAndSubmit(event) {
  // Prevent the browser from submitting immediately
  event.preventDefault();

  var form = event.target;
  var input = form.querySelector("#q");
  var error = document.getElementById("error");

  // Clear previous state
  error.style.display = "none";
  error.textContent = "";
  input.classList.remove("invalid");

  var value = input.value.trim();

  // Basic validation: required and minimum length
  if (!value) {
    input.classList.add("invalid");
    error.textContent = "Please enter a search term.";
    error.style.display = "block";
    input.focus();
    return false;
  }

  if (value.length < 2) {
    input.classList.add("invalid");
    error.textContent = "Please enter at least 2 characters.";
    error.style.display = "block";
    input.focus();
    return false;
  }

  // If validation passes, submit the form. Because the form's target is _blank,
  // this will open the search results in a new tab.
  form.submit();
  return true;
}

function bindings() {
  var form = document.querySelector('form[role="search"]');
  if (!form) {
    console.warn("Search form not found for binding.");
    return;
  }

  form.addEventListener("submit", validateAndSubmit);
  console.log("Bound search form submit to validateAndSubmit");
}

// Use window.onload to ensure DOM is ready
window.onload = bindings;