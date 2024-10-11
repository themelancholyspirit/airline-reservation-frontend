import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaTimes } from 'react-icons/fa';
import StripePaymentForm from './StripePaymentForm';
import axios from 'axios';
import { useAuth } from '../AuthContext';

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

interface FlightBookingModalProps {
  flight: Flight;
  onClose: () => void;
  onBook: () => void;
  setIsPurchaseSuccessful: React.Dispatch<React.SetStateAction<boolean>>;
}

const FlightBookingModal: React.FC<FlightBookingModalProps> = ({ flight, onClose, onBook, setIsPurchaseSuccessful }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const { token } = useAuth();

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

  const handlePaymentComplete = async () => {
    try {
      const booking = {
        flight_id: flight.ID,
        seat_number: "A1", // This should be dynamically assigned or selected by the user
        booking_time: new Date().toISOString(),
        status: "Confirmed",
        departure_city: flight.DepartureAirport,
        arrival_city: flight.ArrivalAirport,
        departure_time: flight.DepartureTime,
        arrival_time: flight.ArrivalTime
      };

      console.log("Booking:", booking);

      const response = await axios.post('http://localhost:8080/bookings', booking, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 200) {
        onBook();
        setIsPurchaseSuccessful(true);
        onClose(); // Close the modal immediately after successful booking
      } else {
        setBookingError("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError("An error occurred while creating the booking. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative"
      >
        {!showPaymentForm && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
        )}
        <AnimatePresence mode="wait">
          {!showPaymentForm ? (
            <motion.div
              key="flight-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Flight Details</h2>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaPlane className="text-blue-500 mr-2" size={24} />
                    <span className="text-2xl font-bold">{flight.FlightNumber}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{flight.Status}</p>
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="text-lg font-semibold">{flight.DepartureAirport}</p>
                    <p className="text-md">{formatDate(flight.DepartureTime)}</p>
                  </div>
                  <div className="text-center">
                    <FaClock className="inline-block text-gray-400 mb-1" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold">
                      {calculateDuration(flight.DepartureTime, flight.ArrivalTime)}h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Arrival</p>
                    <p className="text-lg font-semibold">{flight.ArrivalAirport}</p>
                    <p className="text-md">{formatDate(flight.ArrivalTime)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaUsers className="text-gray-400 mr-2" />
                    <span className="text-lg">
                      {flight.AvailableSeats} seats available
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${flight.Price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {bookingError && (
                <div className="text-red-500 mb-4">{bookingError}</div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="mr-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                >
                  Proceed to Payment
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StripePaymentForm
                amount={flight.Price}
                onPaymentComplete={handlePaymentComplete}
                onCancel={() => {
                  setShowPaymentForm(false);
                  setBookingError(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FlightBookingModal;