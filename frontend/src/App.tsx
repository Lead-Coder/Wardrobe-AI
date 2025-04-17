// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import User from './pages/User'
import Recommendation from './pages/recommendation'
import Try from './pages/try-on'
import Upload from './pages/upload'
import Wardrobe from './pages/wardrobe'
import Chatbot from './pages/chatbot'

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<User />} />
        <Route path="/try-on" element={<Try />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/wardrobe" element={<Wardrobe />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
