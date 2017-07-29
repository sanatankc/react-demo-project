import React, { Component } from 'react'
import './App.css'

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]
const isSearched = 
  (searchTerm, item) => 
    !searchTerm || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list,
      searchTerm: '',
    }
  this.onDismiss = this.onDismiss.bind(this)
  this.onIncrement = this.onIncrement.bind(this)
  this.onDecrement = this.onDecrement.bind(this)
  this.onSearchChange = this.onSearchChange.bind(this)
  }

  onDismiss(id) {
    const updatedList = 
      this.state.list.filter(item => 
        item.objectID !== id
      )
    this.setState({list: updatedList})
  }

  onIncrement(id) {
    const updatedList = this.state.list
    updatedList.map(item =>
      (item.objectID === id) ? 
        item.points += 1 : null
    )
    this.setState({list: updatedList})
  }

  onDecrement(id) {
    const updatedList = this.state.list
    updatedList.map(item =>
      (item.objectID === id) ? 
        item.points -= 1 : null
    )
    this.setState({list: updatedList})
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  render() {
    const {searchTerm, list} = this.state
    return (
      <div className='App'>
        <Search 
          value = {searchTerm}
          onChange = {this.onSearchChange}
        />
        <Table 
          list = {list}
          pattern = {searchTerm}
          onDismiss = {this.onDismiss}
          onIncrement = {this.onIncrement}
          onDecrement = {this.onDecrement}
        />
      </div>
    )
  }
}
class Search extends Component {
  render() {
    const {value, onChange} = this.props
    return (
      <form>
        <input 
          type='text' 
          onChange={onChange} 
          value={value}
        />
      </form>
    )
  }
}

class Table extends Component {
  render() {
    const {list, pattern, onDismiss, onIncrement, onDecrement} = this.props
    return (
      {list
        .filter((item) => isSearched(pattern, item))
        .map(item => 
          <div key = {item.objectID}>
            <span><a href = {item.url}>{item.title}</a></span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button onClick = {() => onDismiss(item.objectID)}>
                Dismiss
              </button>
            </span>
            <span>
              <button onClick = {() => onIncrement(item.objectID)}>
                +
              </button>
            </span>
            <span>
              <button onClick = {() => onDecrement(item.objectID)}>
                -
              </button>
            </span>
          </div>
        )}
    ) 
  }
}
export default App
