import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import OAuth2RedirectHandler from './auth/OAuth2RedirectHandler';
import Home from './pages/Home';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import StockFetcher from './pages/StockFetcher';
import NewsRecommendedStocks from './pages/NewsRecommendedStocks';
import UserDetails from './pages/UserDetails';
import Dashboard from "./pages/dashboard/index";
import Login from './Login';

const App: React.FC = () => {
  const [signedInWith, setSignedInWith] = useState<string>('');

  const handleLogin = () => {
    window.location.href = 'http://localhost:8089/oauth2/authorization/github';
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home setSignedInWith={setSignedInWith} />} 
      />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/searchPage" element={<LandingPage />} />
      <Route path="/stocks/all" element={<StockFetcher />} />
      <Route path="/stocks/recommendation/news" element={<NewsRecommendedStocks />} />
      <Route 
        path="/user-details" 
        element={<UserDetails signedInWith={signedInWith} />} 
      />
      <Route 
        path="/dashboard" 
        element={<Dashboard signedInWith={signedInWith} />} 
      />
      <Route 
        path="/oauth2/redirect" 
        element={<OAuth2RedirectHandler setSignedInWith={setSignedInWith} />} 
      />
    </Routes>
  );
};

export default App;
