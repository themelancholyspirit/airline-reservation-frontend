import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaDollarSign, FaClock, FaSearch, FaExchangeAlt, FaUsers, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import FlightBookingModal from '../components/FlightBookingModal';
import { toast } from 'react-toastify';

interface Flight {
  ID: number;
  FlightNumber: string;
  DepartureAirport: string;
  ArrivalAirport: string;
  DepartureTime: string;
  ArrivalTime: string;
  Capacity: number;
  AvailableSeats: number;
  Price: number;
  Status: string;
}

interface ApiResponse {
  CreatedAt: string;
  DeletedAt: null | string;
  id: number;
  UpdatedAt: string;
  arrivalAirport: string;
  arrivalTime: string;
  availableSeats: number;
  capacity: number;
  departureAirport: string;
  departureTime: string;
  flightNumber: string;
  price: number;
  status: string;
}


const parseApiResponseToFlight = (apiResponse: ApiResponse): Flight => {
  
  return {
    ID: apiResponse.id,
    FlightNumber: apiResponse.flightNumber,
    DepartureAirport: apiResponse.departureAirport,
    ArrivalAirport: apiResponse.arrivalAirport,
    DepartureTime: apiResponse.departureTime,
    ArrivalTime: apiResponse.arrivalTime,
    Capacity: apiResponse.capacity,
    AvailableSeats: apiResponse.availableSeats,
    Price: apiResponse.price,
    Status: apiResponse.status
  };
};

const Flights: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'departureTime' | 'availableSeats'>('price');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseSuccessful, setIsPurchaseSuccessful] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const flightsPerPage = 15;

  const fetchFlights = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/flights');

      const parsedFlights = response.data.map(parseApiResponseToFlight);
      setFlights(parsedFlights);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  useEffect(() => {
    if (isPurchaseSuccessful) {
      setIsModalOpen(false);
      setSelectedFlight(null);
      setShowSuccessIcon(true);
      setTimeout(() => {
        setShowSuccessIcon(false);
        setIsPurchaseSuccessful(false);
      }, 1000);
    }
  }, [isPurchaseSuccessful]);

  const sortFlights = useCallback((flightsToSort: Flight[]) => {
    return [...flightsToSort].sort((a, b) => {
      if (sortBy === 'price') {
        return a.Price - b.Price;
      } else if (sortBy === 'departureTime') {
        return new Date(a.DepartureTime).getTime() - new Date(b.DepartureTime).getTime();
      } else {
        return b.AvailableSeats - a.AvailableSeats;
      }
    });
  }, [sortBy]);

  const filteredAndSortedFlights = useCallback(() => {
    const filtered = flights.filter(
      (flight) =>
        (flight.DepartureAirport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.ArrivalAirport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.FlightNumber?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === null || flight.Status === filterStatus)
    );
    return sortFlights(filtered);
  }, [flights, searchTerm, filterStatus, sortFlights]);

  const handleSearch = () => {
    setIsFiltered(true);
    setCurrentPage(1);
  };

  const displayFlights = isFiltered ? filteredAndSortedFlights() : flights;

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = displayFlights.slice(indexOfFirstFlight, indexOfLastFlight);

  const totalPages = Math.ceil(displayFlights.length / flightsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (departureTime: string, arrivalTime: string) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationInHours = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60);
    return Math.round(durationInHours);
  };

  const changePage = useCallback((newPage: number) => {
    setIsPageLoading(true);
    setCurrentPage(newPage);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 500); // Simulate a short loading time
  }, []);

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  const handleBookFlight = async () => {
    if (!selectedFlight) return;

    try {
      // The actual payment processing is now handled in the StripePaymentForm component
      // Here we just need to update our local state and show a success message

      // Update the available seats
      setFlights(prevFlights =>
        prevFlights.map(flight =>
          flight.ID === selectedFlight.ID
            ? { ...flight, AvailableSeats: flight.AvailableSeats - 1 }
            : flight
        )
      );

      toast.success(`Successfully booked flight ${selectedFlight.FlightNumber}!`);
      setIsPurchaseSuccessful(true);
      setIsModalOpen(false);
      setSelectedFlight(null);
    } catch (error) {
      console.error('Error booking flight:', error);
      toast.error('Failed to book the flight. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <section className="relative bg-gradient-to-b from-black to-gray-900 text-white py-32 overflow-hidden flex items-center justify-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="container mx-auto px-4 relative z-10"
        >
          <h1 className="text-5xl font-bold mb-6 text-center">Find Your Perfect Flight</h1>
          <p className="text-xl mb-12 text-center max-w-2xl mx-auto">
            Discover amazing deals on flights to your dream destinations.
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow flex items-center bg-gray-100 rounded-full p-2 w-full md:w-auto">
                <FaSearch className="text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search by airport or flight number"
                  className="w-full bg-transparent py-2 px-4 text-black leading-tight focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-black text-white py-2 px-4 rounded-full focus:outline-none w-full md:w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'departureTime' | 'availableSeats')}
              >
                <option value="price">Sort by Price</option>
                <option value="departureTime">Sort by Departure Time</option>
                <option value="availableSeats">Sort by Available Seats</option>
              </select>
              <select
                className="bg-black text-white py-2 px-4 rounded-full focus:outline-none w-full md:w-auto"
                value={filterStatus === null ? 'all' : filterStatus}
                onChange={(e) => setFilterStatus(e.target.value === 'all' ? null : e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="On Time">On Time</option>
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </section>

      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="min-h-[calc(100vh-400px)] flex flex-col justify-between">
            <div className="flex-grow">
              <AnimatePresence mode="wait">
                {isLoading || isPageLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-64"
                  >
                    <FaPlane className="text-6xl text-gray-400 animate-spin" />
                  </motion.div>
                ) : currentFlights.length > 0 ? (
                  <motion.div
                    key="flights"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {currentFlights.map((flight) => (
                      <motion.div
                        key={flight.ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-6 rounded-lg shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-center">
                          <div className="mb-4 md:mb-0 flex items-center">
                            <div className="bg-gray-200 p-3 rounded-full mr-4">
                              <FaPlane className="text-gray-600 text-2xl" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-800">{flight.FlightNumber}</h2>
                              <p className="text-gray-600 flex items-center">
                                <span>{flight.DepartureAirport}</span>
                                <FaExchangeAlt className="mx-2" />
                                <span>{flight.ArrivalAirport}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-center md:text-right flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <div>
                              <p className="text-lg font-semibold text-gray-800">
                                {formatDate(flight.DepartureTime)} - {formatDate(flight.ArrivalTime)}
                              </p>
                              <p className="text-gray-600 flex items-center">
                                <FaClock className="mr-1" /> Duration: {calculateDuration(flight.DepartureTime, flight.ArrivalTime)}h
                              </p>
                              <p className="text-gray-600">
                                Status: {flight.Status} | <FaUsers className="inline mr-1" /> {flight.AvailableSeats} seats left
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col items-center">
                            <p className="text-3xl font-bold text-gray-800 flex items-center">
                              <FaDollarSign className="text-xl" />
                              {flight.Price !== undefined ? flight.Price.toFixed(2) : 'N/A'}
                            </p>
                            <button 
                              className="mt-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                              onClick={() => handleSelectFlight(flight)}
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-flights"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-64"
                  >
                    <p className="text-center text-gray-600 text-xl">No flights found. Please try adjusting your search criteria.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => changePage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1 || isPageLoading}
                  className="mx-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={`page-${page}`}
                    onClick={() => changePage(page)}
                    disabled={isPageLoading}
                    className={`mx-1 px-4 py-2 rounded-full ${
                      currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    } ${isPageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages || isPageLoading}
                  className="mx-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {selectedFlight && isModalOpen && (
        <FlightBookingModal
          flight={selectedFlight}
          onClose={handleCloseModal}
          onBook={handleBookFlight}
          setIsPurchaseSuccessful={setIsPurchaseSuccessful}
        />
      )}
      {showSuccessIcon && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-white rounded-full p-8"
          >
            <FaCheckCircle className="text-6xl text-green-500" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Flights;