import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Subscribed with email:', email);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Stay Inspired with Our Newsletter</h2>
          <p className="text-xl mb-10 text-gray-300">
            Join our community of travelers and receive exclusive deals, insider tips, and wanderlust-inducing content.
          </p>
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <div className="relative flex-grow w-full sm:w-auto">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white bg-transparent transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-lg font-semibold"
                >
                  <span>Subscribe</span>
                  <FaPaperPlane />
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg backdrop-blur-md"
              >
                <h3 className="text-2xl font-bold mb-2 text-white">Thank You for Subscribing!</h3>
                <p className="text-gray-300">
                  Get ready for a journey of inspiration. Check your email to confirm your subscription.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;