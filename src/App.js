// version with only functional components and removed comments/notes
import React, { Component } from 'react'
import './App.css'

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://github.com/react.js/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
]
// inline styles
const largeColumn = {
    width: '40%'
}

const midColumn = {
    width: '30%'
}

const smallColumn = {
    width: '10%'
}

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase())

const Table = ({list, pattern, onDismiss}) =>
    <div className="table">
        {list.filter(isSearched(pattern)).map(item =>    
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

const Search = ({value, onChange, children}) => 
    <form>
        {children} <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="search title here"
        />
    </form>

const Button = ({onClick, className = '', children}) => 
        <button
          type="button"
        >
        {children}
        </button>

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      list,
      searchTerm: ''
    }
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onSearchChange=(e)=>{
    this.setState({searchTerm: e.target.value})
  }
 onDismiss(id) {
    const isNotId = listItem => listItem.objectID !== id
    const updatedList = this.state.list.filter(isNotId)
    this.setState({list: updatedList})
 }
  render() {
    const {list, searchTerm} = this.state
    return(
      <div className="page">
        <div className="interactions">
            <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            >
            Search:
            </Search>
        </div>
        <Table
            list={list}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
        />
      </div>
    )
  }
}
export default App;
