import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TaskList from './components/TaskList';
import Login from './components/Login';
import './index.css';

function App() {
  // Track token in state to react to changes
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  React.useEffect(() => {
    // Listen for token changes in localStorage and custom event
    const handleTokenUpdate = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleTokenUpdate);
    window.addEventListener('tokenUpdate', handleTokenUpdate);
    return () => {
      window.removeEventListener('storage', handleTokenUpdate);
      window.removeEventListener('tokenUpdate', handleTokenUpdate);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/tasks" 
            element={token ? <TaskList /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={token ? "/tasks" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;