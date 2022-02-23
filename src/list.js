class List {
  constructor(name) {
    this.name = name;
    this.todo_list = [];
  }

  // get name() {
  //   return this._name;
  // }

  // set name(value) {
  //   this._name = value;
  // }

  add(todo) {
    console.log(todo);
    this.todo_list.push(todo);
  }

  delete(index) {
    this.todo_list.splice(index, 1);
  }

  sortByPriority() {
    this.todo_list.sort(sortListPriorityFunction);
  }
}

function sortListPriorityFunction(a, b) {
  if (a.priority) {
    return -1;
  } else if (!a.priority) {
    return 1;
  }
}

export { List };
