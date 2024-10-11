
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaUser, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import axios from 'axios';

interface Reservation {
  ID: number;
  FlightID: number;
  UserID: number;
  SeatNumber: string;
  BookingTime: string;
  Status: string;
  DepartureCity: string;
  ArrivalCity: string;
  DepartureTime: string;
  ArrivalTime: string;
}

interface ApiReservation {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  flight_id: number;
  user_id: number;
  seat_number: string;
  booking_time: string;
  status: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
}

const parseApiReservation = (apiReservation: ApiReservation): Reservation => {
  return {
    ID: apiReservation.ID,
    FlightID: apiReservation.flight_id,
    UserID: apiReservation.user_id,
    SeatNumber: apiReservation.seat_number,
    BookingTime: apiReservation.booking_time,
    Status: apiReservation.status,
    DepartureCity: apiReservation.departure_city,
    ArrivalCity: apiReservation.arrival_city,
    DepartureTime: apiReservation.departure_time,
    ArrivalTime: apiReservation.arrival_time,
  }
};

const MyBookings: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/bookings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(response.data);
        const parsedReservations = response.data.map(parseApiReservation);
        setReservations(parsedReservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600';
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-900 mb-8 text-center"
        >
          My Bookings
        </motion.h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 opacity-25 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-black rounded-full animate-spin"></div>
              <FaPlane className="absolute inset-0 m-auto text-3xl text-black animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <motion.div
                key={reservation.ID}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaTicketAlt className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Booking ID: {reservation.ID}</span>
                    </div>
                    <span className={`text-sm font-semibold ${getStatusColor(reservation.Status)}`}>
                      {reservation.Status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FaPlane className="text-gray-500 mr-2" />
                      <span className="text-lg font-semibold">
                        {reservation.DepartureCity} to {reservation.ArrivalCity}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Departure: {new Date(reservation.DepartureTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Arrival: {new Date(reservation.ArrivalTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Seat: {reservation.SeatNumber}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <button className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;