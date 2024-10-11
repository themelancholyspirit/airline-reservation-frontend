import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({ destination, onClose }) => {
  if (!destination) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-32 sm:h-40">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <h2 className="absolute bottom-2 left-4 text-xl sm:text-2xl font-bold text-white">{destination.name}</h2>
          </div>
          <div className="p-3 sm:p-4 overflow-y-auto flex-grow">
            <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">{destination.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Best Time to Visit</h3>
                <p className="text-sm sm:text-base text-gray-600">Spring (March to May)</p>
              </div>
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Local Currency</h3>
                <p className="text-sm sm:text-base text-gray-600">Australian Dollar (A$)</p>
              </div>
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Language</h3>
                <p className="text-sm sm:text-base text-gray-600">English</p>
              </div>
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Popular Attractions</h3>
                <p className="text-sm sm:text-base text-gray-600">Sydney Opera House, Harbour Bridge</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold text-sm"
                onClick={() => {/* Add booking logic here */}}
              >
                Book Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-semibold text-sm"
                onClick={onClose}
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DestinationModal;