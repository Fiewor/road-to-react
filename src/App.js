// version using axios
import React, { Component } from 'react'
import axios from 'axios'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

const largeColumn = {
    width: '40%'
}

const midColumn = {
    width: '30%'
}

const smallColumn = {
    width: '10%'
}

const Table = ({list, onDismiss}) =>
    <div className="table">
        {list.map(item =>    
        <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
            Dismiss
            </Button>
            </span>
        </div>)}
    </div>

const Search = ({value, onChange, onSubmit, children}) => 
    <form onSubmit={onSubmit}>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="search title here"
        />
        <button type="submit">
          {children}
        </button>
    </form>

const Button = ({onClick, className = '', children}) => <button type="button"> {children}  </button>

class App extends Component {
  _isMounted = false

  constructor(props){
    super(props)
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm]
  }

  setSearchTopStories(result) {
    const {hits, page} = result
    const {searchKey, results} = this.state
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : []

    const updatedHits = [
      ...oldHits,
      ...hits
    ]

    this.setState({
      results: {
        ...results,
        [searchKey]:{ hits: updatedHits, page }
      }
    })
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    // .then(response => response.json()) using axios eliminates the need for this as axios by default does this i.e. wraps the result into a data object
    .then(result => this._isMounted && this.setSearchTopStories(result))
    // added "this._isMounted &&" to avoid calling "this.setState()" on the component instance even though the component already previously mounted
    // when .isMounted returns false meaning the component has been unmounted for some reason so no need to make the request
    .catch(error => this._isMounted && this.setState({ error }))
  }

  componentDidMount() {
    this._isMounted = true
    
    const {searchTerm} = this.state
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
  }
  
  componentWillUnmount(){
    this._isMounted = false
  }

  onSearchChange=(e)=>{
    this.setState({searchTerm: e.target.value})
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state
    this.setState({searchKey: searchTerm})

    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault()
  }

  onDismiss(id) {
    const {searchKey, results} = this.state
    const {hits, page} = results[searchKey]

    const isNotId = item => item.objectID !== id
    const updatedHits = hits.filter(isNotId)
    
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    })
  }

  render() {
    const {results, searchTerm, searchKey, error} = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list = (results && results[searchKey] && results[searchKey].hits) || []

    return(
      <div className="page">
        <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
            <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            >
            Search
            </Search>
        </div>
        {error
        ? <div className="interactions">
            <p>Uhm...Something went wrong</p>
            <p>List was unable to load</p>
          </div>
        : <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        </div>
    )
  }
}
export default App;
export {Button, Search, Table}