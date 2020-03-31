import React, { useState, useEffect } from "react"
import axios from "axios"

const CountrySearchResults = ({ countrySearch, setCountrySearch, countries }) => {
  const filteredCountries = countries.filter(country => {
    return country.name.toLowerCase().includes(countrySearch.toLowerCase())
  })

  const flagStyle = {
    height: "90px"
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (filteredCountries.length > 1) {
    return (
      <>
        {filteredCountries.map(country => (
          <p key={country.name}>
            {country.name}
            <button onClick={() => setCountrySearch(country.name)}>show</button>
          </p>
        ))}
      </>
    )
  } else if (filteredCountries.length === 1) {
    const country = filteredCountries[0]

    return (
      <>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <h2>languages</h2>
        <ul>
          {country.languages.map(language => {
            return <li key={language.name}>{language.name}</li>
          })}
        </ul>
        <img src={country.flag} alt='' style={flagStyle} />
      </>
    )
  } else {
    return <p>No results found</p>
  }
}

function App() {
  const [countrySearch, setCountrySearch] = useState("")
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      console.log(response.data)
      setCountries(response.data)
    })
  }, [])

  return (
    <div className='App'>
      find countries <input type='text' onChange={event => setCountrySearch(event.target.value)} />
      <CountrySearchResults countrySearch={countrySearch} setCountrySearch={setCountrySearch} countries={countries} />
    </div>
  )
}

export default App
