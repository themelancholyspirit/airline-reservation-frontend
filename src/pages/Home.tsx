import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaUsers, FaSearch, FaExchangeAlt } from 'react-icons/fa';
import FeaturedDestinations from '../components/FeaturedDestinations';
import Newsletter from '../components/Newsletter';

import backgroundVideo from '../assets/videos/travel-background.mp4';

const Home: React.FC = () => {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);
  const [departureSuggestions, setDepartureSuggestions] = useState<string[]>([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState<string[]>([]);
  const departureCityRef = useRef<HTMLInputElement>(null);
  const arrivalCityRef = useRef<HTMLInputElement>(null);
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('roundTrip');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReverse, setIsReverse] = useState(false);

  // Mock list of cities (replace with actual API call in production)
  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'San Francisco', 'Columbus', 'Fort Worth', 'Indianapolis', 'Charlotte', 'Seattle',
    'Denver', 'Washington D.C.'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departureCityRef.current && !departureCityRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false);
      }
      if (arrivalCityRef.current && !arrivalCityRef.current.contains(event.target as Node)) {
        setShowArrivalSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (!isReverse && video.currentTime >= video.duration - 0.1) {
          video.playbackRate = -1;
          setIsReverse(true);
        } else if (isReverse && video.currentTime <= 0.1) {
          video.playbackRate = 1;
          setIsReverse(false);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [isReverse]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>, setCity: React.Dispatch<React.SetStateAction<string>>, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>, setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>) => {
    const value = e.target.value;
    setCity(value);
    if (value.length > 0) {
      const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredCities);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = (city: string, setCity: React.Dispatch<React.SetStateAction<string>>, setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>) => {
    setCity(city);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement reservation logic
    console.log('Reservation details:', { tripType, departureCity, arrivalCity, departureDate, returnDate, passengers });
  };

  const swapCities = () => {
    setDepartureCity(arrivalCity);
    setArrivalCity(departureCity);
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        <section className="relative bg-black text-white py-40 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center leading-tight">
              Embark on Your Next <span className="text-white">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-center max-w-3xl mx-auto font-light">
              Discover seamless travel experiences with AirlineReservation. Your journey to extraordinary destinations begins here.
            </p>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-8">
                <div className="flex justify-center space-x-4 bg-gray-100 p-2 rounded-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      tripType === 'oneWay'
                        ? 'bg-black text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setTripType('oneWay')}
                    type="button"
                  >
                    One Way
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      tripType === 'roundTrip'
                        ? 'bg-black text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setTripType('roundTrip')}
                    type="button"
                  >
                    Round Trip
                  </motion.button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="relative" ref={departureCityRef}>
                  <label htmlFor="departureCity" className="block mb-2 text-sm font-semibold text-black">Departure City</label>
                  <div className="relative">
                    <FaPlane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="departureCity"
                      value={departureCity}
                      onChange={(e) => handleCityChange(e, setDepartureCity, setDepartureSuggestions, setShowDepartureSuggestions)}
                      onFocus={() => setShowDepartureSuggestions(true)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                      placeholder="Enter departure city"
                    />
                  </div>
                  <AnimatePresence>
                    {showDepartureSuggestions && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
                      >
                        {departureSuggestions.map((city, index) => (
                          <motion.li
                            key={index}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            className="px-4 py-2 cursor-pointer text-black"
                            onClick={() => handleCitySelect(city, setDepartureCity, setShowDepartureSuggestions)}
                          >
                            {city}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative" ref={arrivalCityRef}>
                  <label htmlFor="arrivalCity" className="block mb-2 text-sm font-semibold text-black">Arrival City</label>
                  <div className="relative">
                    <FaPlane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="arrivalCity"
                      value={arrivalCity}
                      onChange={(e) => handleCityChange(e, setArrivalCity, setArrivalSuggestions, setShowArrivalSuggestions)}
                      onFocus={() => setShowArrivalSuggestions(true)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                      placeholder="Enter arrival city"
                    />
                  </div>
                  <AnimatePresence>
                    {showArrivalSuggestions && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
                      >
                        {arrivalSuggestions.map((city, index) => (
                          <motion.li
                            key={index}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            className="px-4 py-2 cursor-pointer text-black"
                            onClick={() => handleCitySelect(city, setArrivalCity, setShowArrivalSuggestions)}
                          >
                            {city}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={swapCities}
                  type="button"
                  className="bg-gray-200 p-3 rounded-full text-gray-600 hover:bg-gray-300 transition-all duration-300"
                >
                  <FaExchangeAlt />
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div className="relative">
                  <label htmlFor="departureDate" className="block mb-2 text-sm font-semibold text-black">Departure Date</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      id="departureDate"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
                {tripType === 'roundTrip' && (
                  <div className="relative">
                    <label htmlFor="returnDate" className="block mb-2 text-sm font-semibold text-black">Return Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        id="returnDate"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>
                )}
                <div className="relative">
                  <label htmlFor="passengers" className="block mb-2 text-sm font-semibold text-black">Passengers</label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      id="passengers"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      min="1"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0, 0, 0)" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-lg font-semibold"
                  >
                    <FaSearch className="mr-2" />
                    <span>Search Flights</span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </section>
        <FeaturedDestinations />
        <Newsletter />
      </div>
    </>
  );
};

export default Home;
