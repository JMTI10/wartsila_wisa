import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import MainChart from './components/MainChart';
import Sidebar from './components/Sidebar';
import Engine from './components/Engine';

// Create a layout component that conditionally shows sidebar
function Layout({ children, showSidebar }) {
  return (
    <div className="main-layout">
      {showSidebar && <Sidebar />}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/engine';

  return (
    <div className="App">
      <Layout showSidebar={showSidebar}>
        <Routes>
          <Route path="/" element={<MainChart />} />
          <Route path="/engine" element={<Engine />} />
        </Routes>
      </Layout>
    </div>
  );
}

// Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}