import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaBell, FaBars, FaPlane, FaCalendarAlt, FaHome, FaTicketAlt, FaBookmark, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'
import NotificationsModal from './NotificationModal';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Mock flight suggestions (replace with actual API call in production)
  const allFlightSuggestions = [
    { id: 1, from: 'New York', to: 'London', date: '2023-07-15' },
    { id: 2, from: 'Paris', to: 'Tokyo', date: '2023-07-20' },
    { id: 3, from: 'Los Angeles', to: 'Sydney', date: '2023-07-25' },
    { id: 4, from: 'Dubai', to: 'Singapore', date: '2023-07-30' },
  ];

  const [filteredSuggestions, setFilteredSuggestions] = useState(allFlightSuggestions);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    
    if (value) {
      const filtered = allFlightSuggestions.filter(
        flight =>
          flight.from.toLowerCase().includes(value) ||
          flight.to.toLowerCase().includes(value) ||
          flight.date.includes(value)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(allFlightSuggestions);
    }
    
    setShowSuggestions(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-4 px-6 shadow-lg fixed w-full z-50">
      <div className="container mx-auto">
        <nav className="flex flex-wrap justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <FaPlane className="h-8 w-8 text-white transform group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-lg font-bold tracking-wide group-hover:text-blue-300 transition-colors duration-300">
              AirlineReservation
            </span>
          </Link>

          <button
            className="lg:hidden text-white focus:outline-none hover:text-blue-300 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={24} />
          </button>

          <div className={`w-full lg:flex lg:items-center lg:w-auto ${isMenuOpen ? 'block' : 'hidden'} mt-4 lg:mt-0`}>
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search flights..."
                  className="bg-white text-black rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300 w-64 transition-all duration-300 hover:shadow-md"
                  onFocus={handleSearchFocus}
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
                <AnimatePresence>
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute mt-2 w-full bg-white rounded-md shadow-lg overflow-hidden z-10"
                    >
                      {filteredSuggestions.map((flight) => (
                        <motion.div
                          key={flight.id}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          className="px-4 py-3 cursor-pointer text-black border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                          onClick={() => {
                            setSearchQuery(`${flight.from} to ${flight.to}`);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex items-center">
                            <FaPlane className="text-gray-400 mr-3" />
                            <div>
                              <div className="font-semibold">{flight.from} to {flight.to}</div>
                              <div className="text-sm text-gray-600 flex items-center mt-1">
                                <FaCalendarAlt className="mr-1" /> {flight.date}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/" className="text-sm font-medium hover:text-blue-300 transition-colors duration-300 flex items-center group">
                <FaHome className="mr-2 group-hover:scale-110 transition-transform duration-300" /> Home
              </Link>
              <Link to="/flights" className="text-sm font-medium hover:text-blue-300 transition-colors duration-300 flex items-center group">
                <FaPlane className="mr-2 group-hover:scale-110 transition-transform duration-300" /> Flights
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/bookings" className="text-sm font-medium hover:text-blue-300 transition-colors duration-300 flex items-center group">
                    <FaBookmark className="mr-2 group-hover:scale-110 transition-transform duration-300" /> My Bookings
                  </Link>
                  <Link to="/profile" className="text-sm font-medium hover:text-blue-300 transition-colors duration-300 flex items-center group">
                    <FaUser className="mr-2 group-hover:scale-110 transition-transform duration-300" /> Profile
                  </Link>
                  <button 
                    className="text-sm font-medium hover:text-blue-300 transition-colors duration-300 flex items-center group"
                    onClick={() => setIsNotificationsOpen(true)}
                  >
                    <FaBell className="mr-2 group-hover:scale-110 transition-transform duration-300" /> Notifications
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center group"
                  >
                    <FaSignOutAlt className="mr-2 group-hover:scale-110 transition-transform duration-300" /> Log Out
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link 
                    to="/signup" 
                    className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
      />
    </header>
  );
};

export default Header;