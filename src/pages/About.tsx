import React from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaUsers, FaGlobeAmericas, FaStar, FaHeart } from 'react-icons/fa';

const About: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-black text-white py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/airplane-sky.jpg" 
            alt="Airplane in the sky" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <motion.h1 
            className="text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            About AirlineReservation
          </motion.h1>
          <p className="text-2xl mb-12 text-center max-w-3xl mx-auto leading-relaxed">
            Elevating your journey, connecting dreams, and bringing the world closer through exceptional air travel experiences.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center space-x-12"
          >
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <FaPlane className="text-5xl mb-3 mx-auto text-blue-400" />
              <p className="text-xl font-semibold">500+ Routes</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <FaUsers className="text-5xl mb-3 mx-auto text-purple-400" />
              <p className="text-xl font-semibold">10M+ Passengers</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <FaGlobeAmericas className="text-5xl mb-3 mx-auto text-green-400" />
              <p className="text-xl font-semibold">100+ Countries</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Founded in 2023, AirlineReservation emerged from a vision to revolutionize air travel. We set out to create an airline that not only connects destinations but also brings people closer to their dreams and aspirations.
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Our journey began with a commitment to innovation, safety, and unparalleled customer experience. Today, we're proud to be a leading name in the aviation industry, serving millions of passengers across the globe.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Discover Our Journey
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img 
                src="/images/about-image.jpg" 
                alt="AirlineReservation Team" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <motion.div 
                className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-2xl font-bold text-gray-800">15+</p>
                <p className="text-gray-600 text-base">Years of Excellence</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: FaStar, title: "Safety First", description: "Your well-being is our top priority, guiding every decision we make." },
                { icon: FaHeart, title: "Customer-Centric", description: "We go above and beyond to create memorable experiences for our passengers." },
                { icon: FaPlane, title: "Innovation", description: "Continuously pushing boundaries to redefine the future of air travel." }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 text-base">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-cover bg-center" style={{backgroundImage: 'url("/images/sky-background.jpg")'}}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white bg-opacity-95 p-12 rounded-2xl shadow-xl max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Join Us on Our Journey</h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              At AirlineReservation, we're more than just an airline – we're your partner in exploration and discovery. 
              Join us as we continue to push the boundaries of what air travel can be, and let's create unforgettable 
              experiences together.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Book Your Next Adventure
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;