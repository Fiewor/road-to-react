import React, {Component} from 'react'

class BindingPractice extends Component {
constructor(props){
    super(props)
    this.onClickMe = this.onClickMe.bind(this)
    
    //  don't do the below (i.e. define the business logic of the class method inside the constructor) because it will cluster the constructor over time
    // this.onClickMe = () => {
    //     console.log(this)
    // }

    // instead you should only instantiate you class with all its properties and keep business logic of clas methods outside the constructor
     this.doSomething = this.doSomething.bind(this)
     this.doSomethingElse = this.doSomethingElse.bind(this)

    // doSomething(){
        // do something
    // }
        
    // doSomethingElse(){
        // do something else
    // }
}
    onClickMe(){
        console.log(this)
    }

    // using the arrow function eliminates the need for the binding
    // onClickMe=()=>{
    //     console.log(this)
    // }

    render(){
        return(
            // <button onClick={this.onClickMe = this.onClickMe.bind(this)} type="button">
            // don't do the above (i.e. do the class method binding in the render() class method because it leads to performance implications since it runs every time the component updates)
            <button onClick={this.onClickMe} type="button">
                Click
            </button>
        )
    }
}

export default BindingPractice