import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import OAuth2RedirectHandler from './auth/OAuth2RedirectHandler';
import Home from './pages/Home';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import StockFetcher from './pages/StockFetcher';
import NewsRecommendedStocks from './pages/NewsRecommendedStocks';
import UserDetails from './pages/UserDetails';
import Dashboard from "./pages/dashboard/index";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8089/oauth2/authorization/github';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setSignedInWith={function (value: React.SetStateAction<string>): void {
          throw new Error('Function not implemented.');
        } } />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/searchPage" element={<LandingPage />} />
        <Route path="/stocks/all" element={<StockFetcher />} />
        <Route path="/stocks/recommendation/news" element={<NewsRecommendedStocks />} />
      </Routes>
    </Router>
    // <div>
    //   <h2>Login</h2>
    //   <button onClick={handleLogin}>Login with GitHub</button>
    // </div>
  );
};

const App: React.FC = () => {
  const [signedInWith, setSignedInWith] = useState<string>("")
  return (

    <Routes>
      {/* <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} /> */}
      <Route path="/" element={<Home setSignedInWith={setSignedInWith} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-details" element={<UserDetails signedInWith={signedInWith} />} />
      <Route path="/dashboard" element={<Dashboard signedInWith={signedInWith} />} />
    </Routes>

  );
};

export default App;
