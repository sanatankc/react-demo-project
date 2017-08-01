import React, { Component } from 'react'
import loading from './loading.gif'
import './App.css'

const DEFAULT_QUERY = 'redux'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const DEFAULT_PAGE = 0

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)

  }
  
  setSearchTopStories(result) {
    this.setState({result})
  }

  fetchSearchTopStories(searchTerm, page) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.setSearchTopStories(result)
      })
      .catch(e => e)
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE)
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id
    const updatedHits = 
      this.state.result.hits.filter(isNotId)
    this.setState({
      result: {...this.state.result, hits: updatedHits}
    })
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state
    this.setState({result: null})
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE)
    event.preventDefault()
  }

  render() {
    const {searchTerm, result} = this.state
    const page = result ? result.page : 0
    return (
      <div className='page'>
        <div className='interactions'>
          <Search 
            value = {searchTerm}
            onChange = {this.onSearchChange}
            onSubmit = {this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result 
          ? <Table 
              result = {result.hits}
              pattern = {searchTerm}
              onDismiss = {this.onDismiss}
            />
          : <div style = {{
              'height': 'calc(100vh - 77px)',
              'display': 'flex',
              'justifyContent': 'center',
              'alignItems': 'center',
            }}>
              <img
                alt=' '
                src={loading}
                style={{
                  'width': '100px',
                  'height': '100px'
                }} />
            </div>
        }
        <div class='interactions'>
          <button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              Next
          </button>
        </div>
      </div>
    )
  }
}

const Search = ({value, onChange, onSubmit,children}) =>
  <form onSubmit={onSubmit}>
    <input 
      type='text' 
      onChange={onChange} 
      value={value}
    />
    <button type='submit'>{children}</button>
  </form>

const Table = 
  ({result, pattern, onDismiss}) => {
      if (result.length !== 0) {
        return (
          <div className='table'>
            <TableHeading/>
            {result
              .map(item => 
                <div key = {item.objectID} className='table-row'>
                  <span className='large-column'>
                    <a href={item.url}  target='_blank'>{item.title}</a>
                  </span>
                  <span className='mid-column'>{item.author}</span>
                  <span className='small-column'>
                    <a href={`https://news.ycombinator.com/item?id=${item.objectID}`}
                       target='_blank'>{item.num_comments}</a>
                  </span>
                  <span className='small-column'>{item.points}</span>
                  <span className='small-column'>
                    <button onClick = {() => onDismiss(item.objectID)} className='button-inline'>
                      Dismiss
                    </button>
                  </span>
                </div>
               )
            }
          </div>
        )
        
      }
      else {
        return <p>No result Found</p>
      } 
  }
    
export default App

const TableHeading = () => 
  <div className='table-row'>
    <span className='large-column table-title'>Title</span>
    <span className='mid-column table-title'>Author</span>
    <span className='small-column table-title'>Comments</span>
    <span className='small-column table-title'>Points</span>
  </div>
