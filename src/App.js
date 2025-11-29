import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AlertsPage from './pages/AlertsPage';
import FoodRequestsPage from './pages/FoodRequestsPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/food-requests" element={<FoodRequestsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
