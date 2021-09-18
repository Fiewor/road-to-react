// version using API
import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '5'

// const PATH_BASE = 'https://hn.foo.com/api/v1'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='
// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

const largeColumn = {
    width: '40%'
}

const midColumn = {
    width: '30%'
}

const smallColumn = {
    width: '10%'
}

// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase())

// const Table = ({list, pattern, onDismiss}) =>
const Table = ({list, onDismiss}) =>
    <div className="table">
        {/* removing the filter functionality because there will be no client-side filter(search) anymore */}
        {/* {list.filter(isSearched(pattern)).map(item =>     */}
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
  constructor(props){
    super(props)
    this.state = {
      results: null,
      searchKey: '', // used to store each result
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
    // this.setState({result})
    //functionality to concatenate old and new list of hits from the local state and new result object instead of just overriding the previous page of data
    const {hits, page} = result
    const {searchKey, results} = this.state
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : []
    // const oldHits = page !== 0
    // ? this.state.result.hits
    // : []

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
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => this.setState({ error }))
  }

  componentDidMount() {
    const {searchTerm} = this.state
    this.setState({searchKey: searchTerm})
    this.fetchSearchTopStories(searchTerm)
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
    const isNotId = listItem => listItem.objectID !== id
    // const updatedHits = this.state.result.hits.filter(isNotId)
    const updatedHits = hits.filter(isNotId)
    this.setState({
      result: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
      // result: Object.assign({}, this.state.result, {hits: updatedHits})
    })
 }

  render() {
    // console.log(this.state);
    const {results, searchTerm, searchKey, error} = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list = (results && results[searchKey] && results[searchKey].hits) || []
    // const page = (result && result.page) || 0
    // if(!result) {return null}

    // if (error){
    //   return <p>Uhm...Something went wrong</p>
    // }

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
            // list={result.hits}
            // pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        }
        </div>
    )
  }
}
export default App;
