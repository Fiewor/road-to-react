// import { render, screen } from '@testing-library/react';
import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import App, {Search, Button, Table} from './App';

Enzyme.configure({ adapter: new Adapter() })

// snapshots tests are basic. they only cover that the component doesn't change its output
// once it changes the output, decision is made to accept the changes of fix the output when the output is not the desired output

describe('App', () => {
  // this first test renders the Search component to the DOM and verifies that there is no error during the rendering preocess
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
  // this test is used to store a snapshot of the rendered component and to run it against a previous snapshot
  test('has a valid snapshot', () =>{
    const component = renderer.create(
      <App />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Search>Search</Search>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test('has a valid snapshot', () =>{
    const component = renderer.create(
      <App />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Button', () => {
  it('renders without crashing', () =>{
    const div = document.createElement('div')
    ReactDOM.render(<Button>Give Me More</Button>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test('has a valid snapshot', () => {
    const component = renderer.create(<Button>Give Me More</Button>)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  
})

describe('Table', () => {
  const props = {
    list: [
      {title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y'},
      {title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z'},
    ],
  }

  it('shows two items in list', ()=>{
    // shallow renders the component without its child components so that the test can be very dedicated to one component
    const element = shallow(
      <Table {...props} />
    )
    expect(element.find('.table-row').length).toBe(2)
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Table {...props} />, div)
  })

  test('has a valid snapshot', () => {
    const component = renderer.create(<Table {...props} />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  
})
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
