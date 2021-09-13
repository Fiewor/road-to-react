class Developer{
    constructor(firstName, lastName){
        this.firstName = firstName
        this.lastName = lastName
    }
    getName(){
        return this.firstName + " " + this.lastName
    }
}

const John =  new Developer("John", "Fiewor")
const Ezekiel =  new Developer("Ezekiel", "Akinola")
console.log(John.getName())
console.log(Ezekiel.getName())