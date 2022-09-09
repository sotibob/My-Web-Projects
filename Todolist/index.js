// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
	// const baseUrl = "https://jsonplaceholder.typicode.com";
    const baseUrl = 'http://localhost:3000';
	const todopath = "todos";

	const getTodos = () =>
		fetch([baseUrl, todopath].join("/")).then((response) =>
			response.json()
		);

	const deleteTodo = (id) =>
		fetch([baseUrl, todopath, id].join("/"), {
			method: "DELETE",
		});

    const editTodo = (id, todo) =>
		fetch([baseUrl, todopath, id].join("/"), {
			method: "PUT",
            body: JSON.stringify(todo),
            headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		}).then((response) => response.json());

	const addTodo = (todo) =>
		fetch([baseUrl, todopath].join("/"), {
			method: "POST",
			body: JSON.stringify(todo),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		}).then((response) => response.json());

	return {
		getTodos,
		deleteTodo,
        addTodo,
        editTodo
	};
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
	const domstr = {
		todocontainer1: "#todolist_container1",
        todocontainer2: "#todolist_container2",
		inputbox: ".todolist__input",
	};

	const render = (ele, tmp) => {
		ele.innerHTML = tmp;
	};
	const createTmp = (arr) => {
		let tmp = "";
        if (arr[i]. completed === false) {
            arr.forEach((todo) => {
                tmp += `
                
                <div class="todo">
                    <input class="align value="${todo.title}" inputText" type="text">
                    <svg focusable="false" class="small editbtn"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg focusable="false" class="small deletebtn"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                    <svg focusable="false" class="small moveRight"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                </div>
          `;
            });
        }
        else {
            arr.forEach((todo) => {
                tmp += `
                <div class="todo">
                    <svg focusable="false" class="small moveLeft"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    <input class="align value="${todo.title}" inputText" type="text">
                    <svg focusable="false" class="small editbtn"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg focusable="false" class="small deletebtn"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                </div>
          `;
            });
        }
		return tmp;
	};

	return {
		render,
		createTmp,
		domstr,
	};
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
	const { getTodos, deleteTodo, addTodo, editTodo } = api;

	class Todo {
		constructor(title) {
			this.userId = true;
			this.completed = false;
			this.title = title;
		}
	}

	class State {
		#todolist = [];
        #done = [];

		get todolist() {
			return [...this.#todolist, ...this.#done];
		}

        get todoList() {
            return this.#todolist;
        }

        get done() {
            return this.#done
        }

		set todolist(newtodolist) {
            for(let i = 0; i < this.newtodolist.length; i++) {
                if(newtodolist[i].completed === false) {
			        this.#todolist.push(newtodolist[i]);
                }
                else {
                    this.#done.push(newtodolist[i]);
                }
            }

			const todocontainer1 = document.querySelector(
				view.domstr.todocontainer1
			);
            const todocontainer2 = document.querySelector(
				view.domstr.todocontainer2
			);
			const tmp1 = view.createTmp(this.#todolist);
            const tmp2 = view.createTmp(this.#done);
			view.render(todocontainer1, tmp1);
            view.render(todocontainer2, tmp2);
		}
	}

	return {
		getTodos,
		deleteTodo,
        addTodo,
        editTodo,
		State,
		Todo,
	};
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
	const state = new model.State();

	const deleteTodo = () => {
		const todocontainer = document.querySelector(
			view.domstr.todocontainer1, view.domstr.todocontainer2
		);
		todocontainer.addEventListener("click", (event) => {
			if (event.target.className === "deletebtn") {
				state.todolist = state.todolist.filter(
					(todo) => +todo.id !== +event.target.id
				);
				model.deleteTodo(event.target.id);
			}
		});
	};

	const addTodo = () => {
        const add = document.querySelector("addBtn");
		const inputbox = document.querySelector(view.domstr.inputbox);
		inputbox.addEventListener("keyup", (event) => {
            add.addEventListener("click", () => {
                if (event.target.value.trim() !== '') {
                    const todo = new model.Todo(event.target.value);
                    model.addTodo(todo).then(todofromBE => {
                        console.log(todofromBE);
                        state.todolist = [todofromBE, ...state.todolist];
                    });
                    event.target.value = '';
                }
            })
		});
	};

    const editTodo = () => {
        const todocontainer = document.querySelector(
			view.domstr.todocontainer
		);
        const inputText = document.querySelector(".inputText");
		todocontainer.addEventListener("click", (event) => {
			if (event.target.className === "editbtn") {
                inputText.classList.add("changeable");
                inputbox.addEventListener("keyup", (event) => {
                    if (event.key === "Enter" && event.target.value.trim() !== '') {
                        const todo = new model.Todo(event.target.value);
                        const id = new model.Todo(event.target.id);
                        model.editTodo(id, todo).then(todofromBE => {
                            console.log(todofromBE);
                            state.todolist = [todofromBE, ...state.todolist];
                        });
                        inputText.classList.remove("changeable");
                    }
                });
			}
		});
    };

    const move = () => {
        const move = document.querySelector(".small");
        move.addEventListener("click", (event) => {
            if(event.target.className === "moveRight") {
                const todo = new model.Todo(event.target.value);
                const id = new model.Todo(event.target.id);
                state.todolist[state.todolist.indexOf(todo)].completed = true;
                model.editTodo(id, todo).then(todofromBE => {
                    console.log(todofromBE);
                    state.todolist = [todofromBE, ...state.todolist];
                });
            }
            else if (event.target.className === "moveLeft") {
                const todo = new model.Todo(event.target.value);
                const id = new model.Todo(event.target.id);
                state.todolist[state.todolist.indexOf(todo)].completed = false;
                model.editTodo(id, todo).then(todofromBE => {
                    console.log(todofromBE);
                    state.todolist = [todofromBE, ...state.todolist];
                });
            }
        });

    }

	const init = () => {
		model.getTodos().then((todos) => {
			state.todolist = todos.reverse();
		});
	};

	const bootstrap = () => {
		init();
		deleteTodo();
		addTodo();
        editTodo();
        move();
	};

	return { bootstrap };
})(Model, View);

Controller.bootstrap();