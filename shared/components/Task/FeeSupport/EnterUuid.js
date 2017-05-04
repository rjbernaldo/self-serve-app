import React from 'react'

export default ({ task, fetchFees }) => {
  const submitForm = (e) => {
    e.preventDefault()
    
    fetchFees()
  }
  
  return (
    <ul>
      <li>Retrieve all fees for marketplace</li>
      { task.error ? task.error : null }
      <li>
        <form onSubmit={ (e) => {  submitForm(e) } }>
          <input type="submit"></input>
        </form>
      </li>
    </ul>
  )
}
