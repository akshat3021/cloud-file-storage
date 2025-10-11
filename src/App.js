import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup'; // 1. Import Signup

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} /> {/* 2. Add the new route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;