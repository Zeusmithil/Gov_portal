import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ServiceCard({ service }) {
  const navigate = useNavigate()

  return (
    <div
      className="service-card"
      onClick={() => navigate(`/process/${service.id}`)}
    >
      <div className="service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.subtitle}</p>
      <div className="service-meta">
        <span>⏱ {service.time}</span>
        <span>💰 {service.fee}</span>
        <span>📄 {service.docs.length} docs</span>
      </div>
    </div>
  )
}
