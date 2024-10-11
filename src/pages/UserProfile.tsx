import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPlaneDeparture, FaTimes, FaEdit, FaPlane } from 'react-icons/fa';
import axios from 'axios';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface Flight {
  id: string;
  from: string;
  to: string;
  date: string;
  status: 'upcoming' | 'completed';
}

const UserProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [flights, setFlights] = useState<Flight[]>([
    { id: '1', from: 'New York', to: 'London', date: '2023-06-15', status: 'upcoming' },
    { id: '2', from: 'London', to: 'Paris', date: '2023-05-01', status: 'completed' },
    { id: '3', from: 'Paris', to: 'New York', date: '2023-05-10', status: 'completed' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'flights'>('info');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`http://localhost:8080/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      const token = localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('No token found or user info is null');
      }

      const response = await axios.put(`http://localhost:8080/profile`, userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('User updated successfully');
        // You might want to show a success message to the user here
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      // You might want to show an error message to the user here
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>No user data available</div>;
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen pt-24">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Welcome, {userInfo.name}</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </motion.button>
            </div>

            <div className="flex mb-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === 'info' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                } rounded-l-md transition-colors duration-300`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('flights')}
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === 'flights' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                } rounded-r-md transition-colors duration-300`}
              >
                Flight History
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: FaUser, label: 'Name', value: userInfo.name },
                      { icon: FaEnvelope, label: 'Email', value: userInfo.email },
                      { icon: FaUser, label: 'User ID', value: userInfo.id },
                    ].map((field, index) => (
                      <div key={`${field.label}-${index}`} className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <field.icon className="mr-2 text-gray-600" />
                          {field.label}
                        </label>
                        <p className="text-gray-900 font-semibold">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'flights' && (
                <motion.div
                  key="flights"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    {flights.map((flight) => (
                      <motion.div
                        key={flight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-50 p-4 rounded-lg flex items-center"
                      >
                        <FaPlane className="text-gray-600 mr-4 text-2xl" />
                        <div>
                          <p className="font-semibold text-lg mb-1 text-gray-800">{flight.from} to {flight.to}</p>
                          <p className="text-gray-600 text-sm">Date: {flight.date}</p>
                          <p className={`${flight.status === 'upcoming' ? 'text-gray-700' : 'text-gray-600'} font-medium text-sm mt-1`}>
                            Status: {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {[
                  { icon: FaUser, label: 'Name', name: 'name', type: 'text' },
                  { icon: FaEnvelope, label: 'Email', name: 'email', type: 'email' },
                ].map((field) => (
                  <div key={field.name} className="mb-4">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <field.icon className="mr-2 text-gray-500" />
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={userInfo[field.name as keyof UserInfo]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 transition duration-150 ease-in-out"
                    />
                  </div>
                ))}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;