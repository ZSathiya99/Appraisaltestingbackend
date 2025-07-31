import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProfilePage from './Pages/ProfilePage'
import AppraisalFormPage from './Pages/AppraisalFormPage'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/profile/appraisal-form' element={<AppraisalFormPage />} />
      </Routes>
    </>
  )
}

export default App
