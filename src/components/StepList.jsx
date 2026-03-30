import React from 'react'

export default function StepList({ steps }) {
  if (!steps || steps.length === 0) {
    return <p className="text-muted text-sm"></p>
  }

  return (
    <ul className="steps-list">
      {steps.map((step, index) => (
        <li key={index} className="step-item">
          <div className="step-num">{index + 1}</div>
          <div className="step-content">
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
