import React, { useState, useEffect } from "react"
import personService from "./services/persons"

const Filter = ({ newFilter, setNewFilter }) => {
  return (
    <div>
      {" "}
      filter with shown: <input value={newFilter} onChange={event => setNewFilter(event.target.value)} />
    </div>
  )
}

const Form = ({ persons, newName, newNumber, setPersons, setNewName, setNewNumber, statusMessage, setStatusMessage }) => {
  const addPerson = event => {
    event.preventDefault()

    const existingPersonArray = persons.filter(person => person.name === newName)
    console.log(existingPersonArray)

    if (existingPersonArray.length > 0) {
      const existingPerson = existingPersonArray[0]
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { name: existingPerson.name, number: newNumber }

        personService.update(existingPerson.id, changedPerson).then(returnedPerson => {
          setPersons(persons.map(person => (person.id !== existingPerson.id ? person : returnedPerson)))
          setStatusMessage({ ...statusMessage, success: `Updated ${existingPerson.name}` })
          setTimeout(() => {
            setStatusMessage({ ...statusMessage, success: null })
          }, 5000)
          console.log("updated", persons)
        })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject).then(returnedPerson => {
      console.log(returnedPerson)
      setStatusMessage({ ...statusMessage, success: `Added ${returnedPerson.name}` })
      setTimeout(() => {
        setStatusMessage({ ...statusMessage, success: null })
      }, 5000)
      setPersons(persons.concat(returnedPerson))
      setNewName("")
      setNewNumber("")
    })
  }
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={event => setNewName(event.target.value)} />
      </div>
      <div>
        number:
        <input value={newNumber} onChange={event => setNewNumber(event.target.value)} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, setPersons, newFilter, statusMessage, setStatusMessage }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const deletePerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(response => {
          setPersons(persons.filter(personObject => personObject.id !== person.id))
          setStatusMessage({ ...statusMessage, success: `Deleted ${person.name}` })
          console.log(statusMessage)
          setTimeout(() => {
            setStatusMessage({ ...statusMessage, success: null })
          }, 5000)
        })
        .catch(error => {
          setPersons(persons.filter(personTemp => personTemp.id !== person.id))
          setStatusMessage({ ...statusMessage, error: `Information of ${person.name} has already been removed from the server` })
          setTimeout(() => {
            setStatusMessage({ ...statusMessage, error: null })
          }, 5000)
        })
    }
  }

  return (
    <div>
      {filteredPersons.map(person => (
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>delete</button>
        </p>
      ))}
    </div>
  )
}

const Notification = ({ statusMessage }) => {
  if (statusMessage.success) {
    return (
      <>
        <div className='success'>{statusMessage.success}</div>
      </>
    )
  } else if (statusMessage.error) {
    return (
      <>
        <div className='error'>{statusMessage.error}</div>
      </>
    )
  } else {
    return null
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [statusMessage, setStatusMessage] = useState({ success: null, error: null })

  useEffect(() => {
    console.log("effect")
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification statusMessage={statusMessage} />
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      <h2>Add a new</h2>
      <Form
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        statusMessage={statusMessage}
        setStatusMessage={setStatusMessage}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} newFilter={newFilter} statusMessage={statusMessage} setStatusMessage={setStatusMessage} />
    </div>
  )
}

export default App
