import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import StockFetcher from './pages/StockFetcher';
import NewsRecommendedStocks from './pages/NewsRecommendedStocks';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/searchPage" element={<LandingPage />} />
        <Route path="/stocks/all" element={<StockFetcher />} />
        <Route path="/stocks/recommendation/news" element={<NewsRecommendedStocks />} />
      </Routes>
    </Router>
  );
};

export default App;