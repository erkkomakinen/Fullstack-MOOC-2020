import React, { useState } from "react"
import ReactDOM from "react-dom"

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const Statistics = ({ good, neutral, bad }) => {
  const calculateAverage = () => {
    let feedbackValues = good - bad
    if (feedbackValues === 0) {
      return 0
    }
    return feedbackValues / (good + neutral + bad)
  }

  const percentageOfPositiveFeedback = () => {
    if (good === 0) {
      return 0
    }
    return (good / (good + neutral + bad)) * 100
  }

  if (good + neutral + bad === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text='good' value={good} />
          <StatisticsLine text='neutral' value={neutral} />
          <StatisticsLine text='bad' value={bad} />
          <StatisticsLine text='all' value={good + neutral + bad} />
          <StatisticsLine text='average' value={calculateAverage()} />
          <StatisticsLine
            text='positive'
            value={percentageOfPositiveFeedback() + "%"}
          />
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
