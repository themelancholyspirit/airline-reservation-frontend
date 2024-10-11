import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaInfoCircle, FaHeart } from 'react-icons/fa';
import DestinationModal from './DestinationModal';

const destinations = [
  { id: 1, name: 'Paris', image: '../../public/images/paris.jpg', description: 'The City of Light', attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'] },
  { id: 2, name: 'Tokyo', image: '../../public/images/tokyo.jpg', description: 'Where tradition meets future', attractions: ['Tokyo Skytree', 'Senso-ji Temple', 'Shibuya Crossing'] },
  { id: 3, name: 'New York', image: '../../public/images/new-york.jpg', description: 'The city that never sleeps', attractions: ['Statue of Liberty', 'Central Park', 'Times Square'] },
  { id: 4, name: 'Sydney', image: '../../public/images/sydney.jpg', description: 'Harbor city paradise', attractions: ['Sydney Opera House', 'Bondi Beach', 'Harbour Bridge'] },
];

const FeaturedDestinations: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextDestination = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % destinations.length);
  };

  const prevDestination = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length);
  };

  const openModal = (destination: typeof destinations[0]) => {
    setSelectedDestination(destination);
  };

  const closeModal = () => {
    setSelectedDestination(null);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevDestination();
      } else if (event.key === 'ArrowRight') {
        nextDestination();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextDestination();
    }, 7000); // Change slide every 7 seconds for better readability

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-indigo-900 text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Discover Your Next Adventure
        </motion.h2>
        <div className="relative" ref={containerRef}>
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevDestination}
              className="mr-4 bg-white bg-opacity-20 p-4 rounded-full shadow-md hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
              aria-label="Previous destination"
            >
              <FaChevronLeft className="text-white text-2xl" />
            </motion.button>
            <div className="flex-grow overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col md:flex-row items-center justify-center"
                >
                  <div className="w-full md:w-2/3 mb-8 md:mb-0 md:pr-8 flex justify-center relative">
                    <img
                      src={destinations[activeIndex].image}
                      alt={destinations[activeIndex].name}
                      className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(destinations[activeIndex].id)}
                      className="absolute top-4 right-4 bg-white bg-opacity-50 p-2 rounded-full"
                    >
                      <FaHeart className={`text-2xl ${favorites.includes(destinations[activeIndex].id) ? 'text-red-500' : 'text-gray-600'}`} />
                    </motion.button>
                  </div>
                  <div className="w-full md:w-1/3 text-left max-w-md">
                    <motion.h3 
                      key={`title-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                    >
                      {destinations[activeIndex].name}
                    </motion.h3>
                    <motion.p
                      key={`description-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-xl mb-6 text-gray-300"
                    >
                      {destinations[activeIndex].description}
                    </motion.p>
                    <motion.ul 
                      key={`attractions-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="mb-8"
                    >
                      {destinations[activeIndex].attractions.map((attraction, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-center mb-2 text-gray-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <FaInfoCircle className="mr-2 text-blue-400" />
                          {attraction}
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
                      onClick={() => openModal(destinations[activeIndex])}
                    >
                      Explore {destinations[activeIndex].name}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextDestination}
              className="ml-4 bg-white bg-opacity-20 p-4 rounded-full shadow-md hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
              aria-label="Next destination"
            >
              <FaChevronRight className="text-white text-2xl" />
            </motion.button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          {destinations.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full mx-2 focus:outline-none transition-all duration-300 ${
                index === activeIndex ? 'bg-indigo-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to destination ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedDestination && (
          <DestinationModal destination={selectedDestination} onClose={closeModal} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedDestinations;