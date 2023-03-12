import { useState, useEffect } from 'react';

import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Content = (props) => {
  return (
    <>
      {props.personsToShow.map(person => {
        return <p className='person' key={person.id}>{person.name} {person.number} <button id={person.id} onClick={props.handleDelete}>delete</button></p> 
      }) 
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
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    personService
    .getAll()
    .then(response => {
    setPersons(response)
    })
  }, [])

  const personsToShow = searchInput ? 
    persons.filter(person => person.name.slice(0,searchInput.length).toLowerCase() === searchInput.toLowerCase())
    : persons;
  
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    
    let exists = persons.find(person => person.name.toLowerCase() === nameObject.name.toLowerCase());
    let preexisting;
    if(exists) {
      preexisting = persons.filter(person => person.name.toLowerCase() === nameObject.name.toLowerCase())[0];
    }
    if(exists && (preexisting.number === nameObject.number)) {
      alert('name exists');  
      setErrorMessage(
        `The action failed`
      );
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    } else {
      if(exists && (preexisting.number !== nameObject.number)){
        window.confirm(`${nameObject.name} already exists. would you like to change their number to ${nameObject.number}? `)
        let newObject = {
          name: nameObject.name,
          number: nameObject.number,
          id: preexisting.id
        }          
        let newPersons = persons.slice();
        let index = persons.indexOf(persons.filter(person => Number(person.id) === Number(preexisting.id))[0]);
        newPersons[index] = newObject;
        personService
        .update(preexisting.id, newObject)
        .then(response => {
          console.log('response', response);
          setPersons(newPersons);
          setNewName('');
          setNewNumber('');
          setSearchInput('');
        })
        .then(response => {
          setSuccessMessage(
            `${newObject.name}'s number was changed`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          if (error.message === 'Request failed with status code 404') {
            setErrorMessage(
              `${newObject.name}'s information has already been removed`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            if (index === persons.length) {
              setPersons(newPersons.slice(0,index));
            } else {
              setPersons(newPersons.slice(0, index).concat(newPersons.slice(index + 1)));
            }
          } else {
            alert('operation failed');
          }
        })
      } else {
        personService
        .create(nameObject)
        .then(response => {
        setPersons(persons.concat(response));
        setNewName('');
        setNewNumber('');
        setSearchInput('');
        })
        .then(response => {
          setSuccessMessage(
            `${nameObject.name} was added as a contact`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
      }
    }
  }

  const deleteAtId = (id) => {
    let index = persons.indexOf(persons.filter(person => Number(person.id) === Number(id))[0]);
    window.confirm('sure?')
    let newPersons = persons.slice();
    if (index === persons.length) {
      newPersons = newPersons.slice(0,index);
    } else {
      newPersons =  newPersons.slice(0, index).concat(newPersons.slice(index + 1));
    };
    personService
    .remove(id)
    .then(response => {
      setPersons(newPersons);
      setNewName('');
      setNewNumber('');
      setSearchInput('');
    })
    .then(response => {
      setSuccessMessage(
      `id ${id} deleted from database`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    })
  }

  const handleDelete = (event) => {
    event.preventDefault();
    deleteAtId(Number(event.target.id))    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Search searchInput={searchInput} handleSearchChange={handleSearchChange}/>
      <h3>add a new</h3>
      <Form addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Content personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App