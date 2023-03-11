import { useState } from 'react'

const Content = (props) => {
  return (
    <>
      {props.personsToShow.map(person => 
      <p key={person.id}>{person.name} {person.number}</p> 
      ) 
    }
    </>
  )
}

const Search = (props) => {
  return (
    <>
      <div>
          filter shown with: <input value={props.searchInput} onChange={props.handleSearchChange}/>
      </div>
    </>
  )
}

const Form = (props) => {
  return (
    <>
      <form onSubmit={props.addName}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 'Arto Hellas' },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 'Ada Lovelace' },
    { name: 'Dan Abramov', number: '12-43-234345', id: 'Dan Abramov' },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 'Mary Poppendieck' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const personsToShow = searchInput
    ? persons.filter(person => person.name.slice(0,searchInput.length).toLowerCase() === searchInput.toLowerCase())
    : persons;
  
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      id: newName,
      number: newNumber
    }
    if(persons.find(person => person.id.toLowerCase() === nameObject.id.toLowerCase())) {
      alert(`${nameObject.name} already exists`)
    } else {
      setPersons(persons.concat(nameObject));
      setNewName('');
      setNewNumber('');
      setSearchInput('');
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchInput(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Search searchInput={searchInput} handleSearchChange={handleSearchChange}/>
      <h3>add a new</h3>
      <Form addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Content personsToShow={personsToShow} />
    </div>
  )
}

export default App