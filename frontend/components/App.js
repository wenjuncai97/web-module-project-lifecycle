import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoInput: '',
    displayCompleted: true,
  }

  changeHandler = evt => {
    const {value} = evt.target
    this.setState({...this.state, todoInput: value})
  }

  resetForm = () => this.setState({...this.state, todoInput: ''})
  resetError = err => this.setState({...this.state, error: err.response.data.message})

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoInput})
      .then(res => {
        this.setState({...this.state, todos: this.state.todos.concat(res.data.data)})
        this.resetForm()
      })
      .catch(this.resetError)
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
        this.resetError()
      })
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({...this.state, todos: this.state.todos.map(todo => {
          if(todo.id !== id) return todo
          return res.data.data
        })})
      })
      .catch(this.resetError)
  }

  toggleDisplayCompleted = () => {
    this.setState({...this.state, displayCompleted: !this.state.displayCompleted})
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
            this.state.todos.reduce((acc, todo) => {
              if(this.state.displayCompleted || !todo.completed) return acc.concat(
                <div onClick={this.toggleCompleted(todo.id)} key={todo.id}>{todo.name} {todo.completed ? ' ✔️' : ''}</div>
              )
              return acc
            }, [])
          }
        </div>
        <form id="todoForm" onSubmit={this.submitHandler}>
          <input value={this.state.todoInput} onChange={this.changeHandler} type="text" placeholder="Type todo"></input>
          <input type="submit"></input>
        </form>
        <button onClick={this.toggleDisplayCompleted}>{this.state.displayCompleted ? 'Hide' : 'Show'} Completed</button>
      </div>
    )
  }
}
