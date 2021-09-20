// version with only class components and lots of notes as comments

import React, { Component } from 'react'
import './App.css'
// eslint-disable-next-line
import BindingPractice from '../src/binding'

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

// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   }
// }
// above can be re-written using ES6 syntax as:
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase())

class Table extends Component{
  render(){
      const {list, pattern, onDismiss} = this.props
      
      return(
          <div>
              {
                list.filter(isSearched(pattern)).map(item =>
    
                  /* const onHandleDismiss=()=>{
                    this.onDismiss(item.objectID)
                  } */
    
                    <div key={item.objectID}>
                      <span>
                        <a href={item.url}>{item.title}</a>
                      </span>
                      <span>{item.author}</span>
                      <span>{item.num_comments}</span>
                      <span>{item.points}</span>
                      <span>
                        {/* <button type="button" onClick={onHandleDismiss}> */}
                        {/* seperating the code(having the function somewhere else) like is being done above works the same as the one-liner below that makes use of embedded ES6 syntax which evaluates to an expression*/}
                      <Button
                        onClick={() => onDismiss(item.objectID)}
                      >
                      Dismiss
                      </Button>
                      </span>
                    </div>
                )
              }
          </div>
      )
  }
}

class Search extends Component{
  render(){
      const {value, onChange, children} = this.props
      // the children property makes it possible to weave components into each other
      return (
          <form>
              {children} <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  placeholder="search title here"
              />
          </form>
      )
  }
}

class Button extends Component{
  render(){
    const{onClick, className = '', children} = this.props
    // specifying a default value for className property so that when it's not specified when using the Button component, the value will be an empty string instead of 'undefined'
    return(
        <button
          type="button"
        >
        {children}
        </button>
    )
  }
}

// internal component state also known as local state allows you to save, modify and delete properties that ares stored in your component
class App extends Component {
  // constructor is used to initialize internal component state and is called only once when the component initializes
  constructor(props){
    // super(props) sets this.props in the constructor in case you want to access them in the constructor
    super(props)
    this.state = { // set the initial states here
      // list: list is the same as the code below
      list, // use this when the property name in the object is the same as the variable name
      searchTerm: ''
      // the state is bound to the class by using the THIS object thus i can access the local state in my whole component
    }
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onSearchChange=(e)=>{
    this.setState({searchTerm: e.target.value})
  }

  // you're also allowed to use computed property names in es6(don't quite get what this means tbvh)
  /* ES5
    var user = {
      name: 'John'
    }
  */

  /* ES6
    const key = 'name'
    const user = {
      [key]: 'John'
    }
  */
 onDismiss(id) {
    const isNotId = listItem => listItem.objectID !== id
    const updatedList = this.state.list.filter(isNotId)
    this.setState({list: updatedList})
 }
  render() {
    const {list, searchTerm} = this.state // destructuring the local state object so that line 85 can be used to replace line 84
    return(
      <div className="App">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search:
        </Search>
        {/* you can remove the {} and return() when using arrow function because in a concise body
        (something returning just one expression/something with just one statement
        - in this case, a div - I think), an implicit return is attached */}
          {/* {this.state.list.filter(isSearched(this.state.searchTerm)).map(item =>{ */}
          <Table
            list={list}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        {/* <BindingPractice/> */}
      </div>
    )
  }
}
// difference between function vs. arrow function expression in terms of their behaviour with the THIS object
// function() {...}  a function expression always defines its own THIS object
// () => {...}  arrow function  expressions still have the THIS object of the enclosing context
export default App;
