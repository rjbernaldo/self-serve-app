import React from 'react'

export default ({ task }) => {
  let fees = task.data.fees || []

  return (
    <div className="container">
      { 
        fees.map((fee, index) => {
          return (
            <ul key={ index }>
              <li>Name: { fee.name }</li>
              <li>Fee Type Id: { fee.fee_type_id }</li>
              <li>Amount: { fee.amount }</li>
            </ul>
          );
        })
      }
    </div>
  )
}
