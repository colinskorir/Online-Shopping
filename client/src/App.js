import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        {showRegister ? (
          <>
            <Register onRegister={() => setShowRegister(false)} />
            <button className="mt-4 text-blue-600 underline" onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <Login onLogin={() => setIsAuthenticated(true)} />
            <button className="mt-4 text-green-600 underline" onClick={() => setShowRegister(true)}>
              Don't have an account? Register
            </button>
          </>
        )}
      </div>
    );
  }

  // Example protected content
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Online Shop!</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>
    </div>
  );
}

export default App;
