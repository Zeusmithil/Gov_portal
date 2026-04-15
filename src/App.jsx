import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Process from './pages/Process'
import UpdateAadhaar from './pages/aadhar/UpdateAadhaar'
import GetAadhaar from './pages/aadhar/GetAadhaar'
import OnlineTest from './pages/driving/OnlineTest'
import LearnersLicense from './pages/driving/LearnersLicense'
import DrivingSchool from './pages/driving/DrivingSchool'
import OtherServices from './pages/driving/OtherServices'
import NewPassport from './pages/passport/NewPassport'
import PassportRenewal from './pages/passport/PassportRenewal'
import LostDamage from './pages/passport/LostDamage'
import OtherPassPortServices from './pages/passport/OtherPassPortServices'
import NewPatta from './pages/patta/NewPatta'
import PattaNameTransfer from './pages/patta/PattaNameTransfer'
import Suggestions from './pages/Suggestions'
import ResetPassword from './pages/ResetPassword'

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
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
