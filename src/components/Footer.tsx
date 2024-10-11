import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTwitter, FaPlane, FaInfoCircle } from 'react-icons/fa';

const Footer: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 });

  const linkVariants = {
    hover: { scale: 1.05, color: '#ffffff' }
  };

  const socialIconVariants = {
    hover: { scale: 1.2, rotate: 15 }
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMessagePosition({ x: rect.left, y: rect.top - 60 });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <FaPlane className="mr-2 text-blue-400" />
              AirlineReservation
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Embark on your next adventure with us. Experience the world with unparalleled comfort and style.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Destinations', 'Contact'].map((item, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link to={item === 'Home' ?  '/' : item === 'About Us' ? '/about' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-blue-400">Support</h4>
            <ul className="space-y-3">
              {['FAQ', 'Terms of Service', 'Privacy Policy', 'Customer Support'].map((item, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link to={`/`} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-blue-400">Connect With Us</h4>
            <div className="flex space-x-4">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  variants={socialIconVariants}
                  whileHover="hover"
                  onClick={handleSocialClick}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
            <div className="mt-6">
              <h5 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h5>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} AirlineReservation. All rights reserved. | Designed with ❤️ for travelers
          </p>
        </motion.div>
      </div>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="fixed bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
            style={{ left: messagePosition.x, top: messagePosition.y }}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FaInfoCircle className="mr-2 text-xl" />
            <span className="font-semibold">Coming Soon!</span>
            <span className="ml-2">We're working on exciting new features.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;