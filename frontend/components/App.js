import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoInput: '',
  }

  changeHandler = evt => {
    const {value} = evt.target
    this.setState({...this.state, todoInput: value})
  }

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoInput})
      .then(res => {
        this.fetchAllTodos
        this.setState({...this.state, todoInput: ''})
      })
      .catch(err => {
        this.setState({...this.state, error: err.response.data.message})
      })
  }

  submitHandler = (e) => {
    e.preventDefault();
    this.postNewTodo();
  }

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({...this.state, todos: res.data.data})
      })
      .catch(err => {
        this.setState({...this.state, error: err.response.data.message})
      })
  }

  componentDidMount() {
    // fetch all todos from server
    this.fetchAllTodos()
  }

  render() {
    return (
      <div>
        <div id="errors">Error: {this.state.error}</div>
        <div id="todos">
          <h2>Todos:</h2>
          {
            this.state.todos.map(todo => {
              return <div key={todo.id}>{todo.name}</div>
            })
          }
        </div>
        <form id="todoForm" onSubmit={this.submitHandler}>
          <input value={this.state.todoInput} onChange={this.changeHandler} type="text" placeholder="Type todo"></input>
          <input type="submit"></input>
          <button>Clear Completed</button>
        </form>
      </div>
    )
  }
}
