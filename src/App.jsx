import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Process from './pages/Process'
import UpdateAadhaar from './pages/UpdateAadhaar'
import GetAadhaar from './pages/GetAadhaar'
import OnlineTest from './pages/OnlineTest'
import LearnersLicense from './pages/LearnersLicense'
import DrivingSchool from './pages/DrivingSchool'
import OtherServices from './pages/OtherServices'
import NewPassport from './pages/Newpassport'
import PassportRenewal from './pages/PassportRenewal'
import LostDamage from './pages/LostDamage'
import OtherPassPortServices from './pages/OtherPassPortServices'
import NewPatta from './pages/NewPatta'
import PattaNameTransfer from './pages/PattaNameTransfer'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/process/:service" element={<Process />} />
      <Route path="/update-aadhaar" element={<UpdateAadhaar />} />
      <Route path="/get-aadhaar" element={<GetAadhaar />} />
      <Route path="/online-test" element={<OnlineTest />} />
      <Route path="/learners-license" element={<LearnersLicense />} />
      <Route path="/driving-school" element={<DrivingSchool />} />
      <Route path="/other-services" element={<OtherServices />} />
      <Route path="/new-passport" element={<NewPassport />} />
      <Route path="/passport-renewal" element={<PassportRenewal />} />
      <Route path="/lost-damage" element={<LostDamage />} />
      <Route path="/other-passport-services" element={<OtherPassPortServices />} />
      <Route path="/new-patta" element={<NewPatta />} />
      <Route path="/patta-name-transfer" element={<PattaNameTransfer />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
