import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaCheckDouble, FaTrash } from 'react-icons/fa';

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Your flight to London has been confirmed.',
    date: '2023-07-15 10:30 AM',
    read: false,
  },
  {
    id: '2',
    message: 'Reminder: Check-in opens in 24 hours for your flight to Paris.',
    date: '2023-07-14 2:45 PM',
    read: true,
  },
  {
    id: '3',
    message: 'Special offer: 20% off on your next booking!',
    date: '2023-07-13 9:00 AM',
    read: false,
  },
  {
    id: '4',
    message: 'Flight status update: Your flight to Tokyo is on time.',
    date: '2023-07-12 11:15 AM',
    read: true,
  },
];

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, notifications }) => {
  const [displayNotifications, setDisplayNotifications] = useState<Notification[]>(
    notifications.length > 0 ? notifications : mockNotifications
  );

  const handleDeleteAll = () => {
    setDisplayNotifications([]);
  };

  const handleDeleteSingle = (id: string) => {
    setDisplayNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-4 w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <FaBell className="mr-2" /> Notifications
              </h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                <FaTimes />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {displayNotifications.length > 0 ? (
                displayNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="flex items-start">
                      <FaBell className={`mt-1 mr-3 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                      <div className="flex-grow">
                        <p className={`${notification.read ? 'text-gray-600' : 'text-black'} font-medium`}>{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></div>
                      )}
                      <button 
                        onClick={() => handleDeleteSingle(notification.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FaBell className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No new notifications</p>
                </div>
              )}
            </div>
            {displayNotifications.length > 0 && (
              <div className="p-4 bg-gray-50">
                <button 
                  onClick={handleDeleteAll}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                >
                  <FaCheckDouble className="mr-2" /> Delete all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsModal;