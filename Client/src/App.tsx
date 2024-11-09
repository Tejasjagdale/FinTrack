import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import OAuth2RedirectHandler from './auth/OAuth2RedirectHandler';
import Home from './pages/Home';
import UserDetails from './pages/UserDetails';
import Dashboard from "./pages/dashboard/index";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8089/oauth2/authorization/github';
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
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
