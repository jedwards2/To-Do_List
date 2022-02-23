import { Todo } from "./todo.js";
import { List } from "./list.js";

let my_lists = [];

let new_list_button = document.getElementById("new_list_button");
let close_list_form_button = document.getElementById("close_list_form_button");
let submit_button = document.getElementById("submit_list_button");
new_list_button.addEventListener("click", displayListForm);
close_list_form_button.addEventListener("click", closeListForm);
submit_button.addEventListener("click", submitNewList);

function displayListForm() {
  document.getElementById("new_list_form").style.display = "flex";
}

function closeListForm() {
  document.getElementById("new_list_form").style.display = "none";
}

function submitNewList() {
  let form = document.getElementById("new_list_form");
  if (form.name.value.length > 0) {
    let newList = new List(form.name.value);
    my_lists.push(newList);
  }
  closeListForm();
  renderLists();
}

function renderLists() {
  let lists_div = document.getElementById("lists_div");
  removeAllChildNodes(lists_div);

  my_lists.forEach((list, idx) => {
    let newListPair = document.createElement("div");
    newListPair.setAttribute("id", "newListPair");
    let newDelete = document.createElement("button");
    newDelete.textContent = "X";
    newDelete.myParam = idx;
    newDelete.addEventListener("click", deleteListItem);
    newDelete.setAttribute("id", "deleteButton");

    let newButton = document.createElement("button");
    newButton.textContent = list.name;
    newButton.setAttribute("id", "sidebar_button");
    newButton.myParam = idx;
    newButton.addEventListener("click", displayTodos);
    newListPair.appendChild(newButton);
    newListPair.appendChild(newDelete);
    lists_div.appendChild(newListPair);
  });
}

function deleteListItem(evt) {
  let index = evt.target.myParam;
  my_lists.splice(index, 1);
  renderLists();
}

function displayTodos(evt) {
  let todo_list = document.getElementById("todo_list");
  removeAllChildNodes(todo_list);

  //Access list by index
  let index = evt.target.myParam;
  let currentList = my_lists[index];

  let header = document.createElement("h1");
  header.textContent = currentList.name;
  todo_list.appendChild(header);
  let hr = document.createElement("hr");
  todo_list.appendChild(hr);

  newItemDiv(currentList);
  renderTodos(currentList.name);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function createTodo(evt) {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("date").value;
  let priority = document.getElementById("priority").checked;
  let newTodo = new Todo(title, description, date, priority);

  let listName = evt.target.myParam;
  for (let i in my_lists) {
    if (listName == my_lists[i].name) {
      my_lists[i].add(newTodo);
    }
  }
  deleteTodos();
  renderTodos(listName);
}

function deleteTodos() {
  let todo_div = document.getElementById("todo_list");
  let children = todo_div.children;
  for (let i = children.length - 1; i > 2; i--) {
    todo_div.removeChild(children[i]);
  }
}

function renderTodos(listName) {
  let currentList;
  for (let i in my_lists) {
    if (listName == my_lists[i].name) {
      currentList = my_lists[i];
    }
  }
  for (let i in currentList.todo_list) {
    let todo = currentList.todo_list[i];
    let todo_div = document.getElementById("todo_list");

    let itemDiv = document.createElement("div");
    itemDiv.setAttribute("id", "itemDiv");

    let title = document.createElement("h3");
    title.textContent = todo.title;

    let description = document.createElement("p");
    description.textContent = todo.description;

    let date = document.createElement("p");
    date.textContent = todo.dueDate;

    let priority = document.createElement("button");
    priority.type = "button";
    priority.textContent = "O";
    priority.listObj = currentList;
    priority.myParam = currentList.todo_list[i];
    if (currentList.todo_list[i].priority) {
      priority.style["background-color"] = "red";
    } else {
      priority.style["background-color"] = "gray";
    }
    priority.addEventListener("click", prioritySwitch);

    let deleteItemButton = document.createElement("button");
    deleteItemButton.type = "button";
    deleteItemButton.textContent = "X";
    deleteItemButton.listObj = currentList;
    deleteItemButton.index = i;
    deleteItemButton.addEventListener("click", deleteItem);

    itemDiv.appendChild(title);
    itemDiv.appendChild(description);
    itemDiv.appendChild(date);
    itemDiv.appendChild(priority);
    itemDiv.appendChild(deleteItemButton);

    todo_div.appendChild(itemDiv);
  }
}

function deleteItem(evt) {
  let listObj = evt.currentTarget.listObj;
  listObj.delete(evt.currentTarget.index);
  deleteTodos();
  renderTodos(evt.currentTarget.listObj.name);
}

function prioritySwitch(evt) {
  evt.target.myParam.switchPriority();
  if (evt.target.myParam.priority) {
    evt.target.style["background-color"] = "red";
  } else {
    evt.target.style["background-color"] = "gray";
  }

  //sort list by priority
  let listObj = evt.target.listObj;
  listObj.todo_list.sort(sortList);
  deleteTodos();
  renderTodos(evt.currentTarget.listObj.name);
}

function sortList(a, b) {
  if (a.priority) {
    return -1;
  } else if (!a.priority) {
    return 1;
  }
}

function newItemDiv(currentList) {
  let todo_list = document.getElementById("todo_list");
  let newItemDiv = document.createElement("div");
  newItemDiv.setAttribute("id", "newItemDiv");

  let text = document.createElement("h3");
  text.textContent = "Add Item";

  let titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Title";
  titleInput.id = "title";

  let descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.placeholder = "Description";
  descriptionInput.id = "description";

  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.id = "date";

  let priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority?";
  priorityLabel.for = "priority";

  let priorityInput = document.createElement("input");
  priorityInput.type = "checkbox";
  priorityInput.name = "priority";
  priorityInput.id = "priority";

  let newItemButton = document.createElement("button");
  newItemButton.setAttribute("id", "newItemButton");
  newItemButton.textContent = "Submit";
  newItemButton.type = "button";
  newItemButton.myParam = currentList.name;
  newItemButton.addEventListener("click", createTodo);

  newItemDiv.appendChild(text);
  newItemDiv.appendChild(titleInput);
  newItemDiv.appendChild(descriptionInput);
  newItemDiv.appendChild(dateInput);
  newItemDiv.appendChild(priorityLabel);
  newItemDiv.appendChild(priorityInput);
  newItemDiv.appendChild(newItemButton);

  todo_list.appendChild(newItemDiv);
}
