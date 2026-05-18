// todoscript.js
// jQuery TODO list. Add and delete operations only. Delete buttons are bound individually for
// existing rows only. Newly added rows intentionally do NOT have delete handlers bound to show
// students why event delegation is useful.

function createRow(text) {
  var tr = $("<tr>");

  var tdId = $("<td>").text("-");
  
  tr.append(tdId);

  var tdText = $("<td>").text(text);
  tr.append(tdText);

  var tdActions = $("<td>");
  var btn = $("<button>")
    .addClass("btn-delete")
    .attr("type", "button")
    .text("Delete");

  // IMPORTANT: Do NOT bind a click handler here. This is intentional so newly added rows
  // will NOT be removable unless you use event delegation.
  // btn.on('click', function () { tr.remove(); });

  tdActions.append(btn);
  tr.append(tdActions);

  return tr;
}

function addTodo(text) {
  var tbody = $("#todoBody");

  // If the first row is a placeholder empty row, remove it
  tbody.find("tr.empty").remove();

  var tr = createRow(text);
  tbody.append(tr);
}

function bindings() {
  var form = $("#todoForm");
  var input = $("#todoText");
  var tbody = $("#todoBody");

  if (!tbody.length) return;

  // Use event delegation on tbody to handle delete buttons for both existing and new rows
  tbody.on("click", ".btn-delete", function () {
    $(this).closest("tr").remove();
  });

  form.on("submit", function (e) {
    e.preventDefault();
    var v = input.val().trim();
    if (!v) return;
    addTodo(v);
    input.val("");
    input.focus();
  });

  console.log(
    "Bindings for todo form initialized (jQuery, no handlers for new rows)",
  );
}

$(document).ready(bindings);