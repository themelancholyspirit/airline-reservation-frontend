import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Signup from './pages/Signup';
import Flights from './pages/Flights';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';
import Bookings from './pages/Bookings';
import LiveChat from './components/LiveChat';
import { AuthProvider } from './AuthContext';
import Contact from './pages/Contact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="*"
                element={
                  <>
                    <Header />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/flights" element={<Flights />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/contact" element={<Contact />} />
                      </Routes>
                    </main>
                    <Footer />
                    <LiveChat />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

export default App;
